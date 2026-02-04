import { z } from 'zod';
import { objectId } from '../../common/objectId.js';

export const NotificationValidation = {
    markRead: z.object({
        params: z.object({
            id: objectId,
        }),
    }),
};