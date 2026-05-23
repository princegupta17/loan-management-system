import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const verifyJwt = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Authentication token is required");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "JWT secret is not configured");
    }

    try {
      req.user = jwt.verify(token, secret) as AuthUser;
      next();
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }
  },
);
