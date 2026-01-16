
import { Request, Response, NextFunction } from 'express';
import { authService } from "./auth.service.js";
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { clearRefreshToken, sendRefreshToken } from "../../utils/cookie.js";

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.validated!.body;
            const data = await authService.registerUser(body);
            return successResponse(res, data, "User Registered Successfully", 201);
        } catch (error) {
            next(error);
        }
    },

    me: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await authService.me(userId);
            return successResponse(res, data, "Current user fetched successfully", 200)
        } catch (error) {
            next(error)
        }
    },

    verifyEmailOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.validated!.body;
            await authService.verifyEmailOtp(body);
            return successResponse(res, null, "Email Verified Successfully", 200);
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.validated!.body;
            const response = await authService.loginUser(body);
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