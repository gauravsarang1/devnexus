
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

            const data = await SaveService.toggleSaveUser({ saverId, ...body });
            return successResponse(res, data, "User save toggled successfully");
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

            const data = await SaveService.toggleSaveMatch({ saverId, ...body});
            return successResponse(res, data, "Match save toggled successfully");
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

            const data = await SaveService.getsavedUsers(saverId);
            return successResponse(res, data, "Saved users retrieved successfully");
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

            const data = await SaveService.getSavedMatches(saverId);
            return successResponse(res, data, "Saved matches retrieved successfully");
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
            const data = await SaveService.getAll();
            return successResponse(res, data, "All saves fetched successfully");
        } catch (error) {
            // Cast next to any to resolve "no call signatures" error
            (next as any)(error);
        }
    }
};