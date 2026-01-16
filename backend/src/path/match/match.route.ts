
import { matchController } from './match.controller.js';
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.js';
import { MatchValidation } from '../../validation/match/match.validation.js';

export const matchRouter = Router();

matchRouter.get('/', requireAuth, validate(MatchValidation.getAllMatches), matchController.getAllMatches);
matchRouter.get('/:matchId', requireAuth, validate(MatchValidation.getMatchById), matchController.getMatchById);
matchRouter.put('/:matchId/status', requireAuth, validate(MatchValidation.updateStatus), matchController.updateStatus);
matchRouter.post('/', requireAuth, validate(MatchValidation.createMatch), matchController.createMatch);

export default matchRouter;
