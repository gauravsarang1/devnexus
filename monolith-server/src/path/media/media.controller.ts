
import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const mediaController = {
  getUploadSignature: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = 'DevNexus/profiles';
      
      // Generate signature
      const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET!
      );

      return successResponse(res, {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder
      }, "Upload signature generated successfully");
    } catch (error) {
      // Cast next to any to resolve "no call signatures" error
      next(error);
    }
  }
};
