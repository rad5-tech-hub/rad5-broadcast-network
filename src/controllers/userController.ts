import User from "../models/user";
import Agent from "../models/agent";
import { Request, Response } from "express";


export const registerUserUnderAgent = async (req: Request, res: Response) => {
  const { fullName, email, phoneNumber, track } = req.body;
  const { linkCode } = req.params; // get agent sharable link part
  console.log(linkCode)

  if (!fullName || !email || !track || !phoneNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const agent = await Agent.findOne({ where: { sharableLink: linkCode } });

    if (!agent) {
      return res.status(404).json({ message: "Invalid agent link" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User already registered" });
    }

    const newUser = await User.create({
      fullName,
      email,
      phoneNumber,
      track,
      agentId: agent.id,
    });

    return res.status(201).json({ message: "User registered", user: newUser });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};


export const getUsersUnderAgent = async (req: Request, res: Response) => {
  const { agentId } = req.params;

  try {
    const agent : any = await Agent.findByPk(agentId, {
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
