
import { errorResponse, successResponse } from "../../utils/apiResponse.js";
import { NextFunction, Request, Response } from "express";
import { PhotoService } from "./photo.service.js";

export const photoController = {
    createAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { url } = req.validated!.body!;
            const data = await PhotoService.createPhoto({ url, userId, type: 'AVATAR' });
            return successResponse(res, data, "Avatar Created", 201);
        } catch (error) { next(error); }
    },

    editAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { url } = req.validated!.body!;
            const data = await PhotoService.updatePhoto({ url, userId, type: 'AVATAR' as any });
            return successResponse(res, data, "Avatar Updated", 200);
        } catch (error) { next(error); }
    },

    deleteAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await PhotoService.deletePhoto(userId, 'AVATAR');
            return successResponse(res, data, "Avatar Deleted", 200);
        } catch (error) { next(error); }
    },

    createBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { url } = req.validated!.body!;
            const data = await PhotoService.createPhoto({ url, userId, type: 'BACKGROUND' });
            return successResponse(res, data, "Background Created", 201);
        } catch (error) { next(error); }
    },

    editBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { url } = req.validated!.body!;
            // Fixed: Cast 'type' to any to avoid literal type assignment error from Partial<CreatePhotoDTO>
            const data = await PhotoService.updatePhoto({ url, userId, type: 'BACKGROUND' as any });
            return successResponse(res, data, "Background Updated", 200);
        } catch (error) { next(error); }
    },

    deleteBackground: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const data = await PhotoService.deletePhoto(userId, 'BACKGROUND');
            return successResponse(res, data, "Background Deleted", 200);
        } catch (error) { next(error); }
    },

    getPhotoById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await PhotoService.getPhotoById(id as string);
            return successResponse(res, data, "Photo Retrieved", 200);
        } catch (error) { next(error); }
    },

    getPhotos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await PhotoService.getPhotos();
            return successResponse(res, data, "Photos Retrieved", 200);
        } catch (error) { next(error); }
    }
};
