import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Agent from '../models/agent';
import { toSentenceCase } from '../utils/textHelpers';
import { sendNewReferralNotification } from '../utils/sendNewReferralNotification';
import { normalizeParam } from '../utils/normalizeParam';
import dotenv from 'dotenv';
dotenv.config();
import { registerUserSchema, loginSchema } from '../validators/userValidation';
import { ValidationError, NotFoundError, BaseError } from '../utils/customError';
import { recordAuditTrail } from '../utils/auditTrail';

export const registerUserUnderAgent = async (req: Request, res: Response, next: NextFunction) => {
  const { linkCode } = req.params;

  // Validate user input
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    next(new ValidationError(error.details[0].message));
    return;
  }
  const { fullName, email, phoneNumber, track } = req.body;

  try {
    // Check for verified agent
    const agent = await Agent.findOne({
      attributes: ['id', 'fullName', 'email'],
      where: { sharableLink: linkCode, isVerified: true },
    });

    if (!agent) {
      return next(new NotFoundError('Invalid or unverified agent link'));
    }

    // Prevent duplicate user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new BaseError('User already registered', 409));
    }

    const formattedName = toSentenceCase(fullName);

    const newUser = await User.create({
      fullName: formattedName,
      email,
      phoneNumber,
      track,
      agentId: agent.id,
      paymentStatus: 'unpaid',
    });

    // Record audit trail
    await recordAuditTrail({
      email: email,
      action: `User Registered For ${track} Under Agent: ${agent.fullName}`,
      entityType: 'User',
      entityId: newUser.id,
      details: `UserEmail: ${newUser.email}, AgentEmail:${agent.email}`,
    }, next);

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
    next(new BaseError('Registration failed: ' + error.message));
  }
};

export const getUsersUnderAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;
  const normalizedAgentId = normalizeParam(agentId);

  if (!normalizedAgentId) {
    return res.status(400).json({ message: 'Agent id is required' });
  }

  try {
    const agent: any = await Agent.findByPk(normalizedAgentId, {
      include: [
        {
          model: User,
          as: 'Users',
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
