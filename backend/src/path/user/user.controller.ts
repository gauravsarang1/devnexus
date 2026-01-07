
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";

export const userController = {
    current: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await UserService.getUserById(userId);
            if (!response.success) return errorResponse(res, response.error || "User not found", 404);
            return successResponse(res, response.data, "User retrieved successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    saveSubscription: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { subscription } = (req as any).body;
            if (!subscription) return errorResponse(res, "Subscription required", 400);

            const response = await UserService.updatePushSubscription(userId, subscription);
            if (!response.success) return errorResponse(res, response.error || "Update failed", 400);
            
            return successResponse(res, null, "Subscription saved successfully");
        } catch (error) {
            (next as any)(error);
        }
    },

    removePushSubscription: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;

            const response = await UserService.removePushSubscription(userId);
            if (!response.success) return errorResponse(res, response.error || "Update failed", 400);
            
            return successResponse(res, null, "Subscription saved successfully");
        } catch (error) {
            (next as any)(error);
        }
    },

    getActivity: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await UserService.getDashboardActivity(userId);
            if (!response.success) return errorResponse(res, response.error || "Failed to fetch activity", 400);
            return successResponse(res, response.data, "Activity fetched");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    getSuggestions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await UserService.getSuggestedMatches(userId, (req as any).query);
            if (!response.success) return errorResponse(res, response.error || "Failed to fetch suggestions", 400);
            return successResponse(res, response.data, "Suggestions fetched");
        } catch (error) {
            (next as any)(error);
        }
    },

    getMutualSkills: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { otherUserId } = (req as any).params;
            const response = await UserService.getMutualSkills(userId, otherUserId);
            if (!response.success) return errorResponse(res, response.error || "Failed to fetch mutual skills", 400);
            return successResponse(res, response.data, "Mutual skills fetched");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = (req as any).params;
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
            const response = isUuid 
                ? await UserService.getUserById(userId)
                : await UserService.getUserByUId(userId);

            if (!response.success) return errorResponse(res, response.error || "User not found", 404);
            return successResponse(res, response.data, "User retrieved successfully");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!
            const response = await UserService.getAllUsers(userId, req.query);
            if (!response.success) return errorResponse(res, response.error || "Failed to fetch users", 400);
            return successResponse(res, response.data, "Users retrieved");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { body } = (req as any).validated!;
            const response = await UserService.updateProfile(userId, body);
            if (!response.success) return errorResponse(res, response.error || "Update failed", 400);
            return successResponse(res, response.data, "Profile updated");
        } catch (error) { 
            (next as any)(error); 
        }
    },

    updatePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { currentPassword, newPassword } = (req as any).validated!.body;
            const response = await UserService.changePassword(userId, currentPassword, newPassword);
            if (!response.success) return errorResponse(res, response.error || "Failed to change password", 400);
            return successResponse(res, null, "Password updated successfully");
        } catch (error) {
            (next as any)(error);
        }
    },

    deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await UserService.deleteAccount(userId);
            if (!response.success) return errorResponse(res, response.error || "Failed to delete account", 400);
            return successResponse(res, null, "Account deleted successfully");
        } catch (error) {
            (next as any)(error);
        }
    }
};
