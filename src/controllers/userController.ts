import { Request, Response } from "express";
import User from "../models/user";
import Agent from "../models/agent";
import { toSentenceCase } from "../utils/textHelpers"; 
import { sendNewReferralNotification } from "../utils/sendNewReferralNotification";


export const registerUserUnderAgent = async (req: Request, res: Response) => {
  const { fullName, email, phoneNumber, track } = req.body;
  const { linkCode } = req.params;

  if (!fullName || !email || !phoneNumber || !track) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find agent by referral link
    const agent = await Agent.findOne({ where: { sharableLink: linkCode } });

    if (!agent) {
      return res.status(404).json({ message: "Invalid or expired agent link" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    // Save fullName in sentence case
    const formattedName = toSentenceCase(fullName);

    // Register user under the agent
    const newUser = await User.create({
      fullName: formattedName,
      email,
      phoneNumber,
      track,
      agentId: agent.id,
    });

    //send email notification to agent
   await sendNewReferralNotification(agent, {
     fullName: formattedName,
     email,
     phoneNumber,
     track,
   });
    return res.status(201).json({
      message: "User registered successfully under agent",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message || "Unexpected error",
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
          as: "Users", // this alias must match the one used in association if used
        },
      ],
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    return res.status(200).json({
      message: "Users registered under this agent",
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
      .json({ message: "Failed to fetch users", error: error.message });
  }
};


//redirect user
export const redirectToRegistrationForm = (req: Request, res: Response) => {
  const { linkCode } = req.params;

  // Redirect to frontend registration page with ?ref=code
  const frontendUrl = `${process.env.FRONTEND_BASE_URL}/register?ref=${linkCode}`;
  return res.redirect(frontendUrl);
};