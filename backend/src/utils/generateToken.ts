import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

export const generateToken = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};
