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
    "/",
    validate(ProjectValidation.getAllProjects),
    projectController.getAllProjects
);

projectRouter.get(
    "/feed/personalized",
    requireAuth,
    validate(ProjectValidation.getPersonalizedFeed),
    projectController.getPersonalizedFeed
);

projectRouter.get(
    "/feed/trending",
    validate(ProjectValidation.getTrendingProjects),
    projectController.getTrendingProjects
);

projectRouter.get(
    "/user/:userId",
    validate(ProjectValidation.getByUserId),
    projectController.getByUserId
);

projectRouter.get(
    "/slug/:slug",
    validate(ProjectValidation.getBySlug),
    projectController.getBySlug
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

export default projectRouter;
