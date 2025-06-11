import { Request, Response } from 'express';
import Agent from '../models/agent';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from '../validators/userValidation';
require('dotenv').config();
import { sendVerificationEmailAgent } from '../utils/sendVerifyEmail';
import { sendPasswordResetEmail } from '../utils/sendPasswordResetEmail';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { generateShareableLink } from '../utils/slug';
import { toSentenceCase } from '../utils/textHelpers';
import Withdrawal from '../models/withdrawal';
import User from '../models/user';
import WalletTransaction from '../models/walletTransaction';

// register agent
export const register = async (req: Request, res: Response): Promise<void> => {
  // Validate user input
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { fullName, email, password, phoneNumber } = req.body;

  try {
    // Check if agent already exists
    const existingUser = await Agent.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Agent already exists' });
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate shareable link
    const sharableLink = generateShareableLink(fullName, phoneNumber);

    // Generate full referral link using frontend base URL
    const referralLink = `${process.env.FRONTEND_BASE_URL}/${sharableLink}`;

    // Get uploaded image URL from Cloudinary
    const profileImageUrl = req.file?.path;

    // Save fullName in sentence case
    const formattedName = toSentenceCase(fullName);

    // Create new agent
    const newUser = await Agent.create({
      fullName: formattedName,
      email,
      password: hashedPassword,
      phoneNumber,
      sharableLink,
      profileImage: profileImageUrl,
    });

    // Generate verification token
    const payLoad = { id: newUser.id };
    const generateVerificationToken = jwt.sign(
      payLoad,
      process.env.SECRET as string,
      { expiresIn: '1h' },
    );

    await newUser.update({ verificationToken: generateVerificationToken });

    await sendVerificationEmailAgent(newUser.email, generateVerificationToken);

    //exclude sensitive data
    const agentData = newUser.get({ plain: true });
    delete agentData.password;
    delete agentData.verificationToken;

    res.status(200).json({
      message: 'Agent registered successfully',
      data: {
        agentData,
        referralLink, // Include full link in response
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error });
  }
};

//login user with email and password
export const login = async (req: Request, res: Response): Promise<void> => {
  //validate input
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  try {
    const { email, password } = req.body;
    //check if user exist
    const user = await Agent.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: `Invalid Credentials` });
      return;
    }

    //check if password matches
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: `Invalid Credentials` });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        message: 'Your account has been deactivated. Please contact support.',
      });
      return;
    }

    // check if user has verified their email
    if (!user.isVerified) {
      res.status(401).json({ message: 'Please verify your email to log in.' });
      return;
    }
    //generate token for user
    const payLoad = {
      id: user.id,
    };
    const token = jwt.sign(payLoad, process.env.SECRET as string);
    res
      .status(200)
      .json({ message: `User Logged in successfully`, token: token });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error });
    return;
  }
};

//verify email
export const verifyAgentEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Invalid verification token' });
  }

  const agent = await Agent.findOne({ where: { verificationToken: token } });
  if (!agent) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  agent.isVerified = true;
  agent.verificationToken = null;
  await agent.save();

  return res.status(200).send(`
  <html>
    <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f5f5f5;">
      <div style="background: white; display: inline-block; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #28a745;">✅ Email Verified Successfully!</h2>
        <p style="font-size: 16px; color: #333;">Thank you for verifying your email. You can now log in to your account.</p>
        <button 
          onclick="window.location.href='${process.env.FRONTEND_BASE_URL}/signin;" 
          style="
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
          "
        >
          Login Now
        </button>
      </div>
    </body>
  </html>
`);
};

//forget password
export const forgotPassword = async (req: Request, res: Response) => {
  //validate input
  const { error } = forgetPasswordSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  try {
    const { email } = req.body;
    const user = await Agent.findOne({ where: { email } });
    if (!user)
      return res.status(200).json({
        message: 'If user with this email exists, a reset link has be sent',
      });
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    //update user with resetToken and resetTokenExpires
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();
    //send reset password link via email

    await sendPasswordResetEmail(user.email, resetToken);
    return res.status(200).json({ message: 'Password reset link sent' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const { password, confirmPassword } = req.body;
    const { error } = resetPasswordSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    //fetch user by a token
    const user = await Agent.findOne({
      where: { resetToken: token, resetTokenExpires: { [Op.gt]: new Date() } },
    });
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired token' });

    //update user
    user.password = await bcrypt.hash(password, 10);
    (user.resetToken = null), (user.resetTokenExpires = null);
    await user.save();
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const getAgentDashboard = async (req: Request, res: Response) => {
  try {
    const { id: agentId } = (req as any).user;

    const {
      startDate,
      endDate,
      page = '1',
      limit = '10',
    } = req.query as {
      startDate?: string;
      endDate?: string;
      page?: string;
      limit?: string;
    };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    } else if (startDate) {
      dateFilter.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const { count: txCount, rows: transactions } =
      await WalletTransaction.findAndCountAll({
        where: {
          agentId,
          type: 'credit',
          ...dateFilter,
        },
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset,
      });

    const totalEarnings = transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0,
    );

    const totalReferrals = await User.count({
      where: {
        agentId,
      },
    });

    const withdrawals = await Withdrawal.findAll({
      where: {
        agentId,
        status: 'approved',
      },
      attributes: ['amount'],
    });

    const totalWithdrawals = withdrawals.reduce(
      (sum, w) => sum + Number(w.amount),
      0,
    );

    // ✅ Fetch full agent info
    const agent = await Agent.findByPk(agentId, {
      attributes: {
        exclude: ['password'], // make sure to exclude password or sensitive fields
      },
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    return res.status(200).json({
      message: 'Dashboard data retrieved successfully',
      agent,
      stats: {
        totalEarnings,
        totalWithdrawals,
        totalReferrals,
        transactionCount: txCount,
        currentPage: pageNum,
        totalPages: Math.ceil(txCount / limitNum),
        transactions,
      },
    });
  } catch (error: any) {
    console.error('Agent dashboard error:', error);
    return res.status(500).json({
      message: 'Failed to retrieve dashboard',
      error: error.message,
    });
  }
};

//update agent profile image
export const updateAgentProfilePicture = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: agentId } = (req as any).user;

  try {
    const profileImageUrl = req.file?.path;

    if (!profileImageUrl) {
      res.status(400).json({ message: 'No image file uploaded' });
      return;
    }

    const agent = await Agent.findByPk(agentId);
    if (!agent) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }

    agent.profileImage = profileImageUrl;
    await agent.save();

    res.status(200).json({
      message: 'Profile picture updated successfully',
      data: {
        profileImage: agent.profileImage,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
