
import { Request, Response, NextFunction } from 'express';
import { authService, RegisterDTO, LoginDTO } from "./auth.service.js";
import prisma from "../../config/prisma.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { clearRefreshToken, sendRefreshToken } from "../../utils/cookie.js";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom validated property
            const body = (req as any).validated?.body as RegisterDTO;
            
            const response = await authService.registerUser(body);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to Register User", 400);
            }

            return successResponse(res, null, "User Registered Successfully", 201);
        } catch (error) {
            next(error);
        }
    },

    me: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom userId property
            const userId = (req as any).userId!;
            const response = await authService.me(userId);

            if(!response.success) {
                return errorResponse(res, response.error || "Failed to get current user", 400);
            }

            return successResponse(res, response.data, "Current user fetched successfully", 200)
        } catch (error) {
            next(error)
        }
    },

    checkAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access query parameters which are reported as missing on the Request type
            const { uId, email } = (req as any).query as { uId?: string; email?: string };
            if (!uId && !email) return errorResponse(res, "UID or Email required", 400);

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        uId ? { uId: String(uId) } : {},
                        email ? { email: String(email) } : {}
                    ]
                }
            });

            return successResponse(res, { available: !user }, "Availability checked");
        } catch (error) { 
            next(error); 
        }
    },

    verifyEmailOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom validated property
            const body = (req as any).validated?.body as { email: string; otp: string };
            const response = await authService.verifyEmailOtp(body);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to Verify Email OTP", 400);
            }

            return successResponse(res, null, "Email Verified Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom validated property
            const body = req.validated?.body as LoginDTO;
            const response = await authService.loginUser(body);

            if (!response.success) {
                return errorResponse(res, response.error || "Login Failed", 400);
            }

            sendRefreshToken(res, response.refreshToken!);
            return successResponse(res, { accessToken: response.accessToken }, "Login Successful", 200);
        } catch (error) {
            next(error);
        }
    },

    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.headers?.cookie! as string;
            if(!cookie) {
                return errorResponse(res, "Cookie not found", 401);
            }
            
            const token = cookie
                            .split("; ")
                            .find(t => t.startsWith("jid="))
                            ?.split("=")[1];
            
            if (!token) return errorResponse(res, "No token found", 401);
            
            const response = await authService.refreshToken(token);

            if (!response.success) {
                clearRefreshToken(res)
                return errorResponse(res, response.error || "Failed to Refresh Token", 401);
            }

            if(response.refreshToken) sendRefreshToken(res, response.refreshToken);
            return successResponse(res, { accessToken: response.accessToken }, "Token Refreshed Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    logout: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            clearRefreshToken(res);
            return successResponse(res, null, "Logged Out Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            await authService.delete(userId);

            return successResponse(res, null, "Account deleted successfully");
        } catch (error) {
            next(error)
        }
    }
};