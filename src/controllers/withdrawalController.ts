// controllers/withdrawalController.ts
import { Request, Response } from 'express';
import WalletTransaction from '../models/walletTransaction';
import Withdrawal from '../models/withdrawal';
import AgentWallet from '../models/agentWallet';
import Agent from '../models/agent';
import { withdrawalRequestSchema } from '../validators/userValidation';
import { sendAgentNotification } from '../utils/sendAgentNotification'; // helper we'll create
import { sendWithdrawalEmailToAdmin } from '../utils/sendWithdrawalEmailToAdmin';
import sequelize from '../database/db';

export const approveOrRejectWithdrawal = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { action } = req.body; // "approve" or "reject"
  const transaction = await sequelize.transaction();

  try {
    const withdrawal = await Withdrawal.findByPk(id, { transaction });

    if (!withdrawal) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    if (withdrawal.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Withdrawal already processed.' });
    }

    const wallet = await AgentWallet.findOne({
      where: { agentId: withdrawal.agentId },
      transaction,
    });
    const agent = await Agent.findByPk(withdrawal.agentId); // for email or phone

    if (!wallet || !agent) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: 'Agent wallet or profile not found.' });
    }

    if (action === 'approve') {
      if (wallet.balance < withdrawal.amount) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: 'Insufficient wallet balance for approval.' });
      }

      wallet.balance -= withdrawal.amount;
      await wallet.save({ transaction });

      withdrawal.status = 'approved';
      await withdrawal.save({ transaction });

      await WalletTransaction.create(
        {
          agentId: withdrawal.agentId,
          type: 'debit',
          amount: withdrawal.amount,
          description: 'Withdrawal approved by admin',
        },
        { transaction },
      );

      await sendAgentNotification(agent, withdrawal.amount, 'approved');
    } else if (action === 'reject') {
      withdrawal.status = 'rejected';
      await withdrawal.save({ transaction });

      await sendAgentNotification(agent, withdrawal.amount, 'rejected');
    } else {
      await transaction.rollback();
      return res.status(400).json({ message: 'Invalid action' });
    }
    await transaction.commit();
    return res
      .status(200)
      .json({ message: `Withdrawal ${action}d successfully`, withdrawal });
  } catch (err: any) {
    await transaction.rollback();
    return res
      .status(500)
      .json({ message: 'Error processing withdrawal', error: err.message });
  }
};

//request
export const requestWithdrawal = async (req: Request, res: Response) => {
  const { error } = withdrawalRequestSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { agentId, amount, description, bankName, accountNumber, accountName } =
    req.body;

  try {
    const wallet = await AgentWallet.findOne({ where: { agentId } });

    if (!wallet) {
      return res.status(404).json({ message: 'Agent wallet not found.' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }

    const withdrawal = await Withdrawal.create({
      agentId,
      amount,
      description,
      bankName,
      accountNumber,
      accountName,
      status: 'pending',
    });

    await sendWithdrawalEmailToAdmin(agentId, amount, description);

    return res.status(201).json({
      message: 'Withdrawal request submitted.',
      withdrawal,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Error creating withdrawal',
      error: err.message,
    });
  }
};
