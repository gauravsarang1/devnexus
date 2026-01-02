
import { Request, Response, NextFunction } from 'express';
import { authService, RegisterDTO, LoginDTO } from "./auth.service.js";
import prisma from "../../config/prisma.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { clearRefreshToken, sendRefreshToken } from "../../utils/cookie.js";
import { generate6DigitOtp } from "../../utils/generate6DigitOtp.js";
import { sendMail } from "../../email/sendMail.js";
import createVerificationEmailHtml from "../../email/template/createVerificationEmailHtml.js";
import accountSuccessEmailHtml from "../../email/template/accountSuccessEmailHtml.js";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom validated property
            const body = (req as any).validated?.body as RegisterDTO;
            const otp = generate6DigitOtp();
            
            const response = await authService.registerUser({
                ...body,
                otp
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to Register User", 400);
            }

            const { email, name } = response.data!;
            const emailHtml = createVerificationEmailHtml(name, otp);
            await sendMail(email, "Skillswap Account Verification", emailHtml);

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

            const emailHtml = accountSuccessEmailHtml(response.data?.name!);
            await sendMail(response.data!.email!, "Skillswap Account Verified Successfully", emailHtml);

            return successResponse(res, null, "Email Verified Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fixed: Cast req to any to access custom validated property
            const body = (req as any).validated?.body as LoginDTO;
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
            const token = (req as any).cookies?.jid;
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
};