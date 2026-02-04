import { z } from 'zod';
import { objectId } from '../../common/zod/objectId.js';

export const NotificationValidation = {
    markRead: z.object({
        params: z.object({
            id: objectId,
        }),
    }),
};