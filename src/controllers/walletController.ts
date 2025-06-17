import { NextFunction, Request, Response } from 'express';
import AgentWallet from '../models/agentWallet';
import WalletTransaction from '../models/walletTransaction';
import User from '../models/user';
import Agent from '../models/agent';
import { markUserAsPaidSchema } from '../validators/userValidation';
import { sendAgentFundedEmail } from '../utils/sendAgentFundedEmail';
import sequelize from '../database/db';

export const markUserAsPaid = async (req: Request, res: Response) => {
  const { userId, amountPaid, commissionRate = 0.1 } = req.body;

  // Validate input
  const { error } = markUserAsPaidSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    await sequelize.transaction(async (t) => {
      // 1. Find the user and ensure they belong to an agent
      const user = await User.findByPk(userId, { transaction: t });

      if (!user || !user.agentId) {
        throw new Error('User or associated agent not found.');
      }

      if (user.paymentStatus === 'paid') {
        throw new Error('This user has already been marked as paid.');
      }

      // 2. Calculate commission
      const commission = commissionRate * amountPaid;

      // 3. Find or create the agent's wallet
      let wallet = await AgentWallet.findOne({
        where: { agentId: user.agentId },
        transaction: t,
      });

      if (!wallet) {
        wallet = await AgentWallet.create(
          {
            agentId: user.agentId,
            balance: commission,
          },
          { transaction: t },
        );
      } else {
        wallet.balance += commission;
        await wallet.save({ transaction: t });
      }

      // 4. Log the wallet transaction
      await WalletTransaction.create(
        {
          agentId: user.agentId,
          type: 'credit',
          amount: commission,
          description: `Commission (${
            commissionRate * 100
          }%) from payment for user ${user.fullName}`,
        },
        { transaction: t },
      );

      // 5. Mark user as paid
      user.paymentStatus = 'paid';
      await user.save({ transaction: t });

      // 6. Send email notification
      const agent = await Agent.findByPk(user.agentId, { transaction: t });

      if (agent?.email) {
        try {
          await sendAgentFundedEmail(
            { email: agent.email, firstName: agent.fullName?.split(' ')[0] },
            commission,
            user.fullName,
          );
        } catch (emailErr) {
          console.error('Failed to send agent funded email:', emailErr);
        }
      }

      return res.status(200).json({
        message: 'Payment processed, agent credited, and user marked as paid.',
        commission,
        walletBalance: wallet.balance,
      });
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Error processing payment',
      error: err.message,
    });
  }
};

// get all wallet transactions with agent details
export const allWalletTransaction = async (req: Request, res: Response) => {
  try {
    const allTransactions = await WalletTransaction.findAll({
      include: [
        {
          model: Agent,
          attributes: ['id', 'fullName', 'email', 'phoneNumber'], // you can adjust as needed
        },
      ],
      order: [['createdAt', 'DESC']], // optional: show latest first
    });

    return res.status(200).json({
      message: `All agents' transactions retrieved successfully`,
      data: allTransactions,
    });
  } catch (error: any) {
    console.error('Error fetching wallet transactions:', error);
    return res.status(500).json({
      message: 'Failed to fetch wallet transactions',
      error: error.message,
    });
  }
};
