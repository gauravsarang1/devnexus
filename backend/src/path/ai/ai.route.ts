
import { Router } from "express";
import { aiController } from "./ai.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { AiValidation } from "../../validation/ai/ai.validation.js";

const router = Router();

router.post("/suggest-uid", validate(AiValidation.suggestUids), aiController.suggestUids);
router.post("/ask-assistant", validate(AiValidation.askAssistant), aiController.askAssistant);
router.post("/suggest-search", validate(AiValidation.suggestSearch), aiController.suggestSearch);

// Protected refinement and coaching routes
router.post("/refine-bio", requireAuth, validate(AiValidation.refineBio), aiController.refineBio);
router.post("/refine-message", requireAuth, validate(AiValidation.refineMessage), aiController.refineMessage);
router.post("/coach", requireAuth, validate(AiValidation.coachChat), aiController.coachChat);

export default router;
