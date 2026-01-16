
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { objectId } from "../../validation/common/objectId.js";

export const userController = {
    current: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await UserService.getUserById(userId);
            return successResponse(res, data, "User retrieved successfully");
        } catch (error) {
            next(error);
        }
    },

    saveSubscription: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { subscription } = req.validated!.body;
            if (!subscription) return errorResponse(res, "Subscription required", 400);

            await UserService.updatePushSubscription(userId, subscription);
            return successResponse(res, null, "Subscription saved successfully");
        } catch (error) {
            next(error);
        }
    },

    removePushSubscription: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            await UserService.removePushSubscription(userId);
            return successResponse(res, null, "Subscription saved successfully");
        } catch (error) {
            next(error);
        }
    },

    getActivity: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await UserService.getDashboardActivity(userId);
            return successResponse(res, data, "Activity fetched");
        } catch (error) {
            next(error);
        }
    },

    getSuggestions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await UserService.getSuggestedMatches(userId, req.query);
            return successResponse(res, data, "Suggestions fetched");
        } catch (error) {
            next(error);
        }
    },

    getMutualSkills: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { otherUserId } = req.validated!.params;
            const data = await UserService.getMutualSkills(userId, otherUserId);
            return successResponse(res, data, "Mutual skills fetched");
        } catch (error) {
            (next as any)(error);
        }
    },

    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userIdORuId } = req.validated!.params!;
            const currentUserId = req.userId!;
            const isUuid = objectId.safeParse(userIdORuId).success;
            const data = isUuid
                ? await UserService.getUserById(userIdORuId)
                : await UserService.getUserByUId(userIdORuId, currentUserId);
            return successResponse(res, data, "User retrieved successfully");
        } catch (error) {
            next(error);
        }
    },

    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!
            const query = req.validated!.query!;
            const data = await UserService.getAllUsers(userId, query);
            return successResponse(res, data, "Users retrieved");
        } catch (error) {
            next(error);
        }
    },

    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { body } = req.validated!;
            const data = await UserService.updateProfile(userId, body);
            return successResponse(res, data, "Profile updated");
        } catch (error) {
            next(error);
        }
    },

    updatePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { currentPassword, newPassword } = req.validated!.body;
            await UserService.changePassword(userId, currentPassword, newPassword);
            return successResponse(res, null, "Password updated successfully");
        } catch (error) {
            next(error);
        }
    },

    deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            await UserService.deleteAccount(userId);
            return successResponse(res, null, "Account deleted successfully");
        } catch (error) {
            next(error);
        }
    }
};
