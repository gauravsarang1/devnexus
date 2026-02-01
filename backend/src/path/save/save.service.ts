import prisma from "../../config/prisma.js";
import { SaveToggleInput } from "./save.type.js";

export class SaveService {
    static async toggleSave(
        saverId: string,
        data: SaveToggleInput
    ) {
        const where = {
            saverId,
            saveType: data.saveType,
            postId: data.postId ?? null,
            projectId: data.projectId ?? null
        };

        const existing = await prisma.save.findFirst({ where });

        if (existing) {
            await prisma.save.delete({
                where: { id: existing.id }
            });

            return { saved: false };
        }

        await prisma.save.create({
            data: {
                saverId,
                saveType: data.saveType,
                postId: data.postId,
                projectId: data.projectId
            }
        });

        return { saved: true };
    }
}
