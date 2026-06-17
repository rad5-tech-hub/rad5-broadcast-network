import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) =>  {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      res.status(400).json({
        success: false,
        message: "Unauthorized User",
      });
      return;
    }
    const token = authHeaders?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};
