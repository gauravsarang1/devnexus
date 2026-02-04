import { Router } from "express";
import { likeController } from "./like.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { LikeValidation } from "./like.validation.js";

const likeRouter = Router();

likeRouter.post(
    "/toggle",
    requireAuth,
    validate(LikeValidation.toggleLike),
    likeController.toggleLike
);

likeRouter.get(
    "/",
    validate(LikeValidation.getAll),
    likeController.getAll
);

export default likeRouter