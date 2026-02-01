import { ReviewTargetType } from "@prisma/client";
import { CreateReviewDTO } from "./review.type.js";

export class ReviewHelper {
    static buildReviewWhereClause(
        targetType: ReviewTargetType,
        targetId: string
    ) {
        switch (targetType) {
            case ReviewTargetType.USER:
                return { userId: targetId };

            case ReviewTargetType.POST:
                return { postId: targetId };

            case ReviewTargetType.PROJECT:
                return { projectId: targetId };

            default:
                throw new Error(`Unsupported review target type: ${targetType}`);
        }
    }

    static createReviewData(data: CreateReviewDTO) {
        const { targetId, targetType, ...rest } = data;

        switch (targetType) {
            case ReviewTargetType.POST:
                return { postId: targetId, targetType, ...rest };

            case ReviewTargetType.PROJECT:
                return { projectId: targetId, targetType, ...rest };

            case ReviewTargetType.USER:
                return { userId: targetId, targetType, ...rest };

            default:
                throw new Error(`Unsupported review target type: ${targetType}`);
        }
    }

    static formatReviewer(reviewer: any) {
        const { photo = [], ...rest } = reviewer ?? {};
        return {
            ...rest,
            avatar: photo[0]?.url ?? null,
        };
    }

}