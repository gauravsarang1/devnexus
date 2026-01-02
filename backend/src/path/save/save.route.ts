import { saveController } from "./save.controller.js";
import { Router } from "express";
import { requireAuth } from '../../middleware/auth.middleware.js';
import { SaveValidation } from "../../validation/save/save.validationn.js";
import { validate } from "../../middleware/validate.js";

const router = Router();

router.get('/', saveController.getAll);

router.post('/match/:matchId', requireAuth, validate(SaveValidation.toggleSaveMatch), saveController.toggleSaveMatch);
router.get('/match', requireAuth, validate(SaveValidation.getSavedMatch), saveController.getSavedMatches);

router.post('/user/:userId', requireAuth, validate(SaveValidation.toggleUserSave), saveController.toggleSaveUser);
router.get('/user', requireAuth, validate(SaveValidation.getSavedUsers), saveController.getSavedUsers);

export default router;

