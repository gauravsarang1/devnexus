
import prisma from '../../config/prisma.js';
import { ServiceResponse } from '../../types/serviceResponse.js';

export interface CreatePhotoDTO {
    url: string;
    userId: string;
    type: 'AVATAR' | 'BACKGROUND' | 'POST';
}

export class PhotoService {
    static async createPhoto(data: CreatePhotoDTO): Promise<ServiceResponse> {
        // Correctly use the compound unique key defined in schema.prisma
        const photo = await prisma.photo.upsert({
            where: {
                userId_type: {
                    userId: data.userId,
                    type: data.type
                }
            },
            update: { url: data.url },
            create: data
        });

        return { success: true, data: photo };
    }

    static async updatePhoto(data: Partial<CreatePhotoDTO> & { userId: string; type: any }): Promise<ServiceResponse> {
        const photo = await prisma.photo.update({
            where: {
                userId_type: {
                    userId: data.userId,
                    type: data.type
                }
            },
            data: { url: data.url }
        });

        return { success: true, data: photo };
    }

    static async deletePhoto(userId: string, type: any): Promise<ServiceResponse> {
        const photo = await prisma.photo.delete({
            where: {
                userId_type: {
                    userId,
                    type
                }
            }
        });

        return { success: true, data: photo };
    }

    static async getPhotos(): Promise<ServiceResponse> {
        const photos = await prisma.photo.findMany();
        return { success: true, data: photos };
    }

    static async getPhotoById(id: string): Promise<ServiceResponse> {
        const photo = await prisma.photo.findUnique({ where: { id } });
        return { success: true, data: photo };
    }
}
