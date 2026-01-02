
import { Router } from "express";
import { aiController } from "./ai.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/suggest-uid", aiController.suggestUids);
router.post("/ask-assistant", aiController.askAssistant);
router.post("/suggest-search", aiController.suggestSearch);

// Protected refinement and coaching routes
router.post("/refine-bio", requireAuth, aiController.refineBio);
router.post("/refine-message", requireAuth, aiController.refineMessage);
router.post("/coach", requireAuth, aiController.coachChat);

export default router;
