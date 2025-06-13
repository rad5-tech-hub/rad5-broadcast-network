import { Request, Response } from 'express';
import User from '../models/user';
import Agent from '../models/agent';
import { toSentenceCase } from '../utils/textHelpers';
import { sendNewReferralNotification } from '../utils/sendNewReferralNotification';
import dotenv from 'dotenv';
dotenv.config();
import { registerUserSchema } from '../validators/userValidation';

export const registerUserUnderAgent = async (req: Request, res: Response) => {
  const { linkCode } = req.params;

  // Validate user input
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const { fullName, email, phoneNumber, track } = req.body;

  try {
    // Check for verified agent
    const agent = await Agent.findOne({
      where: { sharableLink: linkCode, isVerified: true },
    });

    if (!agent) {
      return res
        .status(404)
        .json({ message: 'Invalid or unverified agent link' });
    }

    // Prevent duplicate user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered' });
    }

    const formattedName = toSentenceCase(fullName);

    const newUser = await User.create({
      fullName: formattedName,
      email,
      phoneNumber,
      track,
      agentId: agent.id,
    });

    await sendNewReferralNotification(agent, {
      fullName: formattedName,
      email,
      phoneNumber,
      track,
    });

    return res.status(201).json({
      message: 'User registered successfully under agent',
      user: newUser,
    });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      message: 'Registration failed. Please try again later.',
      error: error.message || 'Unexpected error',
    });
  }
};

export const getUsersUnderAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;

  try {
    const agent: any = await Agent.findByPk(agentId, {
      include: [
        {
          model: User,
          as: 'Users', // this alias must match the one used in association if used
        },
      ],
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    return res.status(200).json({
      message: 'Users registered under this agent',
      agent: {
        id: agent.id,
        fullName: agent.fullName,
        email: agent.email,
      },
      users: agent.Users || [],
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch users', error: error.message });
  }
};
