import { NextFunction, Request, Response } from "express";
import { USER_ROLES } from "../constants.js";
import { UserRole } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (
      req.user.role === USER_ROLES.ADMIN ||
      allowedRoles.includes(req.user.role)
    ) {
      return next();
    }

    throw new ApiError(403, "You are not authorized to access this resource");
  };
