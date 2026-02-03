import { CreateReviewDTO } from "./review.type.js";

export class ReviewHelper {
    static buildReviewWhereClause(target: {
        userId?: string;
        projectId?: string;
    }) {
        const { userId, projectId } = target;

        if (userId) return { userId };
        if (projectId) return { projectId };

        throw new Error("Invalid review target");
    }

    static createReviewData(data: CreateReviewDTO) {
        const { userId, projectId, ...rest } = data;

        return {
            ...(userId && { userId }),
            ...(projectId && { projectId }),
            ...rest,
        };
    }

    static formatReviewer(reviewer: any) {
        const { photo = [], ...rest } = reviewer ?? {};
        return {
            ...rest,
            avatar: photo[0]?.url ?? null,
        };
    }
}
