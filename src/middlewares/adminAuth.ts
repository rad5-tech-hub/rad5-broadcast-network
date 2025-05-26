import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized User",
      });
    }
    const token = authHeaders?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};
