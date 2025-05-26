import { Request, Response } from "express";
import Agent from "../models/agent";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validators/userValidation";
require("dotenv").config();
import { sendVerificationEmailAgent } from "../utils/sendVerifyEmail";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail";
import crypto from "crypto";
import { Op } from "sequelize";
import { generateShareableLink } from "../utils/slug";
import { toSentenceCase } from "../utils/textHelpers";

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
      res.status(400).json({ message: "Agent already exists" });
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate shareable link
    const sharableLink = generateShareableLink(fullName, phoneNumber);

    // Get uploaded image URL from Cloudinary
    // const profileImage = req.file?.path || null;
    const profileImageUrl = req.file?.path;

    // Save fullName in sentence case
    const formattedName = toSentenceCase(fullName);
    // Create new user
    const newUser = await Agent.create({
      fullName: formattedName,
      email,
      password: hashedPassword,
      phoneNumber,
      sharableLink,
      profileImage: profileImageUrl, // Save image URL
    });

    // Generate verification token
    const payLoad = { id: newUser.id };
    const generateVerificationToken = jwt.sign(
      payLoad,
      process.env.SECRET as string,
      { expiresIn: "1h" }
    );

    await newUser.update({ verificationToken: generateVerificationToken });

    await sendVerificationEmailAgent(newUser.email, generateVerificationToken);

    res.status(200).json({
      message: "Agent registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error });
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
      res
        .status(400)
        .json({ message: `No User Found with this email ${email}` });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        message: "Your account has been deactivated. Please contact support.",
      });
      return;
    }

    //check if password matches
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: `Invalid Credentials` });
      return;
    }

    // check if user has verified their email
    if (!user.isVerified) {
      res.status(401).json({ message: "Please verify your email to log in." });
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
    res.status(500).json({ error: "Server error", details: error });
    return;
  }
};

//verify email
export const verifyAgentEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid verification token" });
  }

  const agent = await Agent.findOne({ where: { verificationToken: token } });
  if (!agent) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  agent.isVerified = true;
  agent.verificationToken = null;
  await agent.save();

  res.status(200).json({ message: "Agent email verified successfully" });
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
    if (!user) return res.status(400).json({ message: `User not found` });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    //update user with resetToken and resetTokenExpires
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();
    //send reset password link via email

    await sendPasswordResetEmail(user.email, resetToken);
    return res.status(200).json({ message: "Password reset link sent" });
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
      return res.status(400).json({ message: "Invalid or expired token" });

    //update user
    user.password = await bcrypt.hash(password, 10);
    (user.resetToken = null), (user.resetTokenExpires = null);
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
