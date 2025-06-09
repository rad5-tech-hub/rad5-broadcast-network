import { NextFunction, Request, Response } from 'express';
import AgentWallet from '../models/agentWallet';
import WalletTransaction from '../models/walletTransaction';
import User from '../models/user';
import Agent from '../models/agent';
import { markUserAsPaidSchema } from '../validators/userValidation';
import { sendAgentFundedEmail } from '../utils/sendAgentFundedEmail';

export const markUserAsPaid = async (req: Request, res: Response) => {
  const { userId, amountPaid, commissionRate = 0.1 } = req.body;
  const { error } = markUserAsPaidSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Dynamic commission calculation (defaults to 10% if not provided)
  const commission = commissionRate * amountPaid;

  try {
    // 1. Find the user and ensure they belong to an agent
    const user = await User.findByPk(userId);

    if (!user || !user.agentId) {
      return res.status(404).json({
        message: 'User or associated agent not found.',
      });
    }

    // 2. Find or create the agent's wallet
    let wallet = await AgentWallet.findOne({
      where: { agentId: user.agentId },
    });

    if (!wallet) {
      wallet = await AgentWallet.create({
        agentId: user.agentId,
        balance: commission, // Start with commission, not 0
      });
    } else {
      // If wallet exists, add commission to balance
      wallet.balance += commission;
      await wallet.save();
    }

    // 3. Log the transaction
    await WalletTransaction.create({
      agentId: user.agentId,
      type: 'credit',
      amount: commission,
      description: `Commission (${
        commissionRate * 100
      }%) from payment for user ${user.fullName}`,
    });

    // 4. Send email notification to agent
    const agent = await Agent.findByPk(user.agentId); 
    try {
      if (agent?.email) {
        await sendAgentFundedEmail(
          { email: agent.email, firstName: agent.fullName?.split(' ')[0] },
          commission,
          user.fullName,
        );
      }
    } catch (emailErr) {
      console.error('Failed to send agent funded email:', emailErr);
    }


    return res.status(200).json({
      message: 'Payment processed and agent credited',
      commission,
      walletBalance: wallet.balance,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: 'Error processing payment',
      error: err.message,
    });
  }
};

export const getAgentWalletAndTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { agentId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // 1. Confirm agent exists (optional, for better error handling)
    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // 2. Get wallet info
    const wallet = await AgentWallet.findOne({ where: { agentId } });

    // 3. Get transactions
    const transactions = await WalletTransaction.findAll({
      where: { agentId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Agent wallet and transaction history',
      agent: {
        id: agent.id,
        name: agent.fullName,
        email: agent.email,
      },
      wallet: {
        balance: wallet?.balance || 0,
      },
      transactions,
    });
  } catch (error: any) {
    next(error);
  }
};

//get all wallet transactions
export const allWalletTransaction = async (req: Request, res: Response) => {
  try {
    const allTransactions = await WalletTransaction.findAll();
    return res.status(200).json({
      messsage: `All Agents's transactions retrived successfully`,
      data: allTransactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Failed to fetch wallet or transactions',
      error: error.message,
    });
  }
};
