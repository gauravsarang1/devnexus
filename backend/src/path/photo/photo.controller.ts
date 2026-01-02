
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { PhotoService } from "./photo.service.js";

export const photoController = {
    createAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { url } = (req as any).validated!.body!;
            const response = await PhotoService.createPhoto({ url, userId, type: 'AVATAR' });
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Avatar Created", 201);
        } catch (error) { next(error); }
    },

    editAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { url } = (req as any).validated!.body!;
            // Fixed: Cast 'type' to any to avoid literal type assignment error from Partial<CreatePhotoDTO>
            const response = await PhotoService.updatePhoto({ url, userId, type: 'AVATAR' as any });
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Avatar Updated", 200);
        } catch (error) { next(error); }
    },

    deleteAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await PhotoService.deletePhoto(userId, 'AVATAR');
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Avatar Deleted", 200);
        } catch (error) { next(error); }
    },

    createBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { url } = (req as any).validated!.body!;
            const response = await PhotoService.createPhoto({ url, userId, type: 'BACKGROUND' });
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Background Created", 201);
        } catch (error) { next(error); }
    },

    editBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const { url } = (req as any).validated!.body!;
            // Fixed: Cast 'type' to any to avoid literal type assignment error from Partial<CreatePhotoDTO>
            const response = await PhotoService.updatePhoto({ url, userId, type: 'BACKGROUND' as any });
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Background Updated", 200);
        } catch (error) { next(error); }
    },

    deleteBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).userId!;
            const response = await PhotoService.deletePhoto(userId, 'BACKGROUND');
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Background Deleted", 200);
        } catch (error) { next(error); }
    },

    getPhotoById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = (req as any).params;
            const response = await PhotoService.getPhotoById(id);
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Photo Retrieved", 200);
        } catch (error) { next(error); }
    },

    getPhotos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await PhotoService.getPhotos();
            if (!response.success) return errorResponse(res, response.error, 500);
            return successResponse(res, response.data, "Photos Retrieved", 200);
        } catch (error) { next(error); }
    }
};
