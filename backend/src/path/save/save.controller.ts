
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { SaveService } from "./save.service.js";

export const saveController = {

    // --------------------------
    // TOGGLE SAVE USER
    // --------------------------
    toggleSaveUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const saverId = (req as any).userId!;      // from JWT, secure
            const body = (req as any).validated!.body!;

            const response = await SaveService.toggleSaveUser({
                saverId,
                ...body
            });

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to toggle save user", 500);
            }

            return successResponse(res, response.data, "User save toggled successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },


    // --------------------------
    // TOGGLE SAVE MATCH
    // --------------------------
    toggleSaveMatch: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId and validated properties
            const saverId = (req as any).userId!;      // secure
            const body = (req as any).validated!.body!;

            const response = await SaveService.toggleSaveMatch({ saverId, ...body});

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to toggle save match", 500);
            }

            return successResponse(res, response.data, "Match save toggled successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },


    // --------------------------
    // GET SAVED USERS
    // --------------------------
    getSavedUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId property
            const saverId = (req as any).userId!;

            const response = await SaveService.getsavedUsers(saverId);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to get saved users", 500);
            }

            return successResponse(res, response.data, "Saved users retrieved successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },


    // --------------------------
    // GET SAVED MATCHES
    // --------------------------
    getSavedMatches: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast req to any to access custom userId property
            const saverId = (req as any).userId!;

            const response = await SaveService.getSavedMatches(saverId);

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to get saved matches", 500);
            }

            return successResponse(res, response.data, "Saved matches retrieved successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    },

    // --------------------------
    // GET ALL SAVES
    // --------------------------
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await SaveService.getAll();

            if (!response.success) {
                return errorResponse(res, response.error || "Failed to get saves", 500);
            }

            return successResponse(res, response.data, "All saves fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};