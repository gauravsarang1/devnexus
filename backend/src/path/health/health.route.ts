
import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
// Use any for res to access status and json methods
router.get('/', (_req: any, res: any) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

export default router;
