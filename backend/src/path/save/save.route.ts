import { Router } from "express";
import { saveController } from "./save.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { SaveValidation } from "../../validation/save/save.validation.js";

const saveRouter = Router();

saveRouter.post(
    "/toggle",
    requireAuth,
    validate(SaveValidation.toggleSave),
    saveController.toggleSave
);

saveRouter.get(
    "/",
    requireAuth,
    validate(SaveValidation.getAllSaves),
    saveController.getAllSaves
);

export default saveRouter;