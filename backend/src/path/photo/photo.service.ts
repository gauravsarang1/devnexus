
import prisma from '../../config/prisma.js';
// Service methods return raw data or throw errors; controllers handle HTTP responses
import { UploadPhotoDTO, Photo } from '../../types/service.types.js';

export class PhotoService {
    static async createPhoto(data: UploadPhotoDTO & { userId: string }): Promise<Photo> {
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

        return photo;
    }

    static async updatePhoto(data: Partial<UploadPhotoDTO> & { userId: string; type: any }): Promise<Photo> {
        const photo = await prisma.photo.update({
            where: {
                userId_type: {
                    userId: data.userId,
                    type: data.type
                }
            },
            data: { url: data.url }
        });

        return photo;
    }

    static async deletePhoto(userId: string, type: any): Promise<null> {
        const photo = await prisma.photo.delete({
            where: {
                userId_type: {
                    userId,
                    type
                }
            }
        });

        return null;
    }

    static async getPhotos(): Promise<any> {
        const photos = await prisma.photo.findMany();
        return photos;
    }

    static async getPhotoById(id: string): Promise<Photo | null> {
        const photo = await prisma.photo.findUnique({ where: { id } });
        return photo;
    }
}
