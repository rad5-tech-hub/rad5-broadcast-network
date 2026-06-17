// controllers/withdrawalController.ts
import { Request, Response, NextFunction } from 'express';
import WalletTransaction from '../models/walletTransaction';
import Withdrawal from '../models/withdrawal';
import AgentWallet from '../models/agentWallet';
import Agent from '../models/agent';
import { withdrawalRequestSchema } from '../validators/userValidation';
import { sendAgentNotification } from '../utils/sendAgentNotification';
import { sendWithdrawalEmailToAdmin } from '../utils/sendWithdrawalEmailToAdmin';
import sequelize from '../database/db';
import { normalizeParam } from '../utils/normalizeParam';
import { ValidationError, NotFoundError, BaseError } from '../utils/customError';
import { recordAuditTrail } from '../utils/auditTrail';

export const approveOrRejectWithdrawal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const normalizedId = normalizeParam(id);
  const { action } = req.body; // "approve" or "reject"
  const transaction = await sequelize.transaction();

  if (!normalizedId) {
    await transaction.rollback();
    return next(new ValidationError('Withdrawal id is required'));
  }

  try {
    const withdrawal = await Withdrawal.findByPk(normalizedId, { transaction });

    if (!withdrawal) {
      await transaction.rollback();
      return next(new NotFoundError('Withdrawal request not found.'));
    }

    if (withdrawal.status !== 'pending') {
      await transaction.rollback();
      return next(new ValidationError('Withdrawal already processed.'));
    }

    const wallet = await AgentWallet.findOne({
      where: { agentId: withdrawal.agentId },
      transaction,
    });
    const agent = await Agent.findByPk(withdrawal.agentId);

    if (!wallet || !agent) {
      await transaction.rollback();
      return next(
        new NotFoundError('Agent wallet or profile not found.'),
      );
    }

    if (action === 'approve') {
      if (wallet.balance < withdrawal.amount) {
        await transaction.rollback();
        return next(
          new ValidationError(
            'Insufficient wallet balance for approval.',
          ),
        );
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
      return next(new ValidationError('Invalid action'));
    }

    await transaction.commit();
    return res.status(200).json({
      message: `Withdrawal ${action}d successfully`,
      withdrawal,
    });
  } catch (err: any) {
    await transaction.rollback();
    next(new BaseError('Error processing withdrawal: ' + err.message));
  }
};

export const requestWithdrawal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = withdrawalRequestSchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  const { amount, description, bankName, accountNumber, accountName } =
    req.body;
    const agentId = req.user.id;

  try {
    const agent = await Agent.findByPk(agentId, {
      attributes: ['id', 'fullName', 'email'],
    });
    if (!agent) {
      return next(new NotFoundError('Agent not found'));
    }

    const wallet = await AgentWallet.findOne({ where: { agentId } });

    if (!wallet) {
      return next(new NotFoundError('Agent wallet not found'));
    }

    if (wallet.balance < amount) {
      return next(new ValidationError('Insufficient wallet balance.'));
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

    await recordAuditTrail(
      {
        email: agent.email,
        action: ` ${agent.fullName} Requested Withdrawal`,
        entityType: 'Withdrawal',
        entityId: withdrawal.id,
        details: `Amount: ${amount}, Bank Name: ${bankName}, Account Name: ${accountName}`,
      },
      next,
    );

    await sendWithdrawalEmailToAdmin(agentId, amount, description);

    return res.status(201).json({
      message: 'Withdrawal request submitted.',
      withdrawal,
    });
  } catch (err: any) {
    next(new BaseError('Error creating withdrawal: ' + err.message));
  }
};

export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const withdrawals = await Withdrawal.findAll({
      where: {
        status: ['pending', 'approved'],
      },
      include: [
        {
          model: Agent,
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Withdrawals retrieved successfully',
      data: withdrawals || [],
    });
  } catch (error: any) {
    console.error('Error fetching withdrawals:', error);
    return res.status(500).json({
      message: 'Failed to retrieve withdrawals',
      error: error.message,
    });
  }
};

export const getAgentWithdrawals = async (req: Request, res: Response) => {
  const { agentId } = req.params;

  try {
    const withdrawals = await Withdrawal.findAll({
      where: {
        agentId,
        status: ['pending', 'approved'],
      },
      include: [
        {
          model: Agent,
          attributes: ['id', 'fullName', 'email', 'phoneNumber'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: `Withdrawals for agent ${agentId} retrieved successfully`,
      data: withdrawals || [],
    });
  } catch (error: any) {
    console.error('Error fetching withdrawals for agent:', error);
    return res.status(500).json({
      message: 'Failed to retrieve agent withdrawals',
      error: error.message,
    });
  }
};

export const payAgent = async (req: Request, res: Response) => {
  const { agentId, amount } = req.body;

  if (!agentId || !amount || isNaN(amount)) {
    return res.status(400).json({
      message: 'agentId and a valid numeric amount are required',
    });
  }

  try {
    await sequelize.transaction(async (t) => {
      const agent = await Agent.findByPk(agentId, { transaction: t });
      if (!agent) {
        throw new Error('Agent not found');
      }

      const wallet = await AgentWallet.findOne({
        where: { agentId },
        transaction: t,
      });

      if (!wallet) {
        throw new Error('Agent wallet not found');
      }

      if (wallet.balance < Number(amount)) {
        throw new Error('Insufficient wallet balance for this transaction');
      }

      wallet.balance -= Number(amount);
      await wallet.save({ transaction: t });

      await WalletTransaction.create(
        {
          agentId,
          type: 'debit',
          amount: Number(amount),
          description: `Manual debit by admin from agent ${agent.fullName}`,
        },
        { transaction: t },
      );

      return res.status(200).json({
        message: 'Agent wallet debited successfully',
        walletBalance: wallet.balance,
      });
    });
  } catch (err: any) {
    console.error('Error debiting agent:', err);
    return res.status(500).json({
      message: 'Error debiting agent wallet',
      error: err.message,
    });
  }
};
