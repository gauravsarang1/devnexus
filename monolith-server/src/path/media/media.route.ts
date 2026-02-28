
import { Router } from 'express';
import { mediaController } from './media.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/sign', requireAuth, mediaController.getUploadSignature);

export default router;
