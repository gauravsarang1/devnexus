
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/apiResponse.js";

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fixed: Cast req to any to access headers property which is reported as missing on the Request type
    const authHeader = (req as any).headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Access token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyAccessToken(token) as TokenPayload;
      // Fixed: Cast req to any to assign custom userId property to the Request object
      (req as any).userId = payload.userId; 
      next();
    } catch (err) {
      return errorResponse(res, "Invalid or expired access token", 401);
    }
  } catch (error) {
    return errorResponse(res, "Authentication failed", 401);
  }
};