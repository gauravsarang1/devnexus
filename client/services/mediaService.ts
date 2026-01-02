
import apiClient from './apiClient';
import axios from 'axios';
import { BaseApiResponse } from '../src/utils/apiResponse';

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
    const signRes = await apiClient.get<SignatureResponse>('/media/sign');
    const { signature, timestamp, apiKey, cloudName, folder } = signRes.data.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('folder', folder);

    const uploadRes = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return uploadRes.data.secure_url;
  }
};
