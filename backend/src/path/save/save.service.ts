
import prisma from '../../config/prisma.js'
// Service methods return raw data or throw errors; controllers handle HTTP responses
import * as PrismaModule from '@prisma/client'
import {
    SaveResponse,
    AllSavesResponse,
    SaveDTO,
} from '../../types/service.types.js';

const { SaveType } = PrismaModule as any;

export class SaveService {
    static async toggleSaveUser(data: { saverId: string, userId: string, type: any }): Promise<SaveResponse | {unsaved: true}> {
        const { saverId, userId } = data;

        const existingsavedMatch = await prisma.save.findUnique({
            where: {
                saverId_userId: {
                    saverId,
                    userId
                }
            }
        });

        if (existingsavedMatch) {
            await prisma.save.delete({
                where: {
                    saverId_userId: {
                        saverId,
                        userId
                    }
                }
            });

            return { unsaved: true };
        }

        const savedMatch = await prisma.save.create({ data });
        return savedMatch;
    };

    static async toggleSaveMatch(data: { saverId: string, matchId: string, type: any }): Promise<SaveResponse | {unsaved: true}> {
        const { saverId, matchId } = data;

        const existingSavedMatch = await prisma.save.findUnique({
            where: {
                saverId_matchId: {
                    saverId,
                    matchId
                }
            }
        });

        if (existingSavedMatch) {
            await prisma.save.delete({
                where: {
                    saverId_matchId: {
                        saverId,
                        matchId
                    }
                }
            });

            return { unsaved: true };
        }

        const savedMatch = await prisma.save.create({ data });
        return savedMatch;
    };

    static async getsavedUsers(saverId: string): Promise<Save[]> {
        const savedUsers = await prisma.save.findMany({
            where: {
                saverId,
                type: 'USER'
            }
        });

        return savedUsers;
    }

    static async getSavedMatches(saverId: string): Promise<Save[]> {
        const savedMatches = await prisma.save.findMany({
            where: {
                saverId,
                type: 'MATCH'
            }
        });

        return savedMatches;
    };

    static async getAll(): Promise<Save[]> {
        const saves = await prisma.save.findMany({});

        return saves;
    }
}
