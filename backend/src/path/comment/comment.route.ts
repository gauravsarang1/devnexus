import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { CommentValidation } from "./comment.validation.js";
import { commentController } from "./comment.controller.js";

const commentRouter = Router();

commentRouter.post(
    "/",
    requireAuth,
    validate(CommentValidation.createComment),
    commentController.create
);

commentRouter.get(
    "/post/:postId",
    validate(CommentValidation.getComments),
    commentController.getAll
);

commentRouter.get(
    "/project/:projectId",
    validate(CommentValidation.getComments),
    commentController.getAll
);

commentRouter.delete(
    "/:commentId",
    requireAuth,
    validate(CommentValidation.deleteComment),
    commentController.delete
);

export default commentRouter
