import apiClient from './apiClient';
import { BaseApiResponse } from '../utils/apiResponse';
import { unwrap } from '../utils/apiHelper';
import { uploadToCloudinary } from '../utils/cloudinary';

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export type SignatureResponse = BaseApiResponse<UploadSignature>;

export const mediaService = {
  uploadImage: async (file: File): Promise<string> => {
    const {
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    } = unwrap(
      await apiClient.get<SignatureResponse>('/media/sign')
    );

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('folder', folder);

    return uploadToCloudinary(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
  },
};
