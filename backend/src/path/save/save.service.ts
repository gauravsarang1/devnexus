
import prisma from '../../config/prisma.js'
import { ServiceResponse } from '../../types/serviceResponse.js'
import * as PrismaModule from '@prisma/client'

const { SaveType } = PrismaModule as any;

export interface ToggleSaveDTO {
    saverId: string
    type: any 
}

export interface ToggleSaveUserDTO extends ToggleSaveDTO {
    userId: string,
}

export interface ToggleSaveMatchDTO extends ToggleSaveDTO {
    matchId: string
}

export class SaveService {
    static async toggleSaveUser(data: ToggleSaveUserDTO): Promise<ServiceResponse> {
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

            return {
                success: true,
                data: { unsaved: true }
            };
        }

        const savedMatch = await prisma.save.create({
            data
        });

        return {
            success: true,
            data: savedMatch
        };
    };

    static async toggleSaveMatch(data: ToggleSaveMatchDTO): Promise<ServiceResponse> {
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

            return {
                success: true,
                data: { unsaved: true }
            };
        }

        const savedMatch = await prisma.save.create({
            data
        });

        return {
            success: true,
            data: savedMatch
        };
    };

    static async getsavedUsers(saverId: string): Promise<ServiceResponse> {
        const savedUsers = await prisma.save.findMany({
            where: {
                saverId,
                type: 'USER'
            }
        });

        return {
            success: true,
            data: savedUsers
        }
    }

    static async getSavedMatches(saverId: string): Promise<ServiceResponse> {
        const savedMatches = await prisma.save.findMany({
            where: {
                saverId,
                type: 'MATCH'
            }
        });

        return {
            success: true,
            data: savedMatches
        }
    };

    static async getAll(): Promise<ServiceResponse> {
        const saves = await prisma.save.findMany({});

        return {
            success: true,
            data: saves
        }
    }
}
