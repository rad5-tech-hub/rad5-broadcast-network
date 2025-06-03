// adminController.ts
import { Request, Response } from 'express';
import Admin from '../models/admin';
import Agent from '../models/agent';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendTutorApprovalEmail } from '../utils/sendTutorApprovalEmail';
import { sendTutorRejectionEmail } from '../utils/sendTutorRejectionEmail';
import User from '../models/user';

// admin/create
export const createAdmin = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return res.status(201).json({ message: 'Admin created', admin });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: 'Error creating admin', error: err.message });
  }
};

//login admin
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
      },
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err: any) {
    return res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// Get all agents
export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await Agent.findAll();
    return res.status(200).json({ agents });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch agents', error: error.message });
  }
};

// // Toggle agent active status
// export const deactivateAgentStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const agent = await Agent.findByPk(id);

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     await agent.update({ isActive: false });

//     return res.status(200).json({
//       message: `Agent has been deactivated"`,
//       agent,
//     });
//   } catch (error: any) {
//     return res
//       .status(500)
//       .json({ message: "Failed to update agent status", error: error.message });
//   }
// };

// // activate agent active status
// export const activateAgentStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const agent = await Agent.findByPk(id);

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     await agent.update({ isActive: true });

//     return res.status(200).json({
//       message: `Agent has been deactivated"`,
//       agent,
//     });
//   } catch (error: any) {
//     return res
//       .status(500)
//       .json({ message: "Failed to update agent status", error: error.message });
//   }
// };
export const toggleAgentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const agent = await Agent.findByPk(id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await agent.update({ isActive: !agent.isActive });
    const status = agent.isActive ? 'activated' : 'deactivated';

    return res.status(200).json({
      message: `Agent has been ${status}`,
      agent,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to update agent status', error: error.message });
  }
};

export const getUsersByAgent = async (req: Request, res: Response) => {
  const { sharableLink } = req.params;

  try {
    const users = await User.findAll({
      where: { sharableLink },
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch users', error: error.message });
  }
};
