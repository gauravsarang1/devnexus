import { Request, Response, NextFunction } from "express";
import { SaveService } from "./save.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const saveController = {
    toggleSave: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const saverId = req.userId!;
            const body = req.validated!.body!;

            const result = await SaveService.toggleSave(
                saverId,
                body
            );

            return successResponse(
                res,
                result,
                "Save updated successfully"
            );
        } catch (error) {
            next(error);
        }
    }
};
