import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { ProjectValidation } from "../../validation/project/project.validation.js";
import { projectController } from "./project.controller.js";

export const projectRouter = Router();

projectRouter.post(
    "/",
    requireAuth,
    validate(ProjectValidation.create),
    projectController.create
);

projectRouter.get(
    "/:projectId",
    validate(ProjectValidation.getById),
    projectController.getById
);

projectRouter.put(
    "/:projectId",
    requireAuth,
    validate(ProjectValidation.update),
    projectController.update
);

projectRouter.delete(
    "/:projectId",
    requireAuth,
    validate(ProjectValidation.delete),
    projectController.delete
);
