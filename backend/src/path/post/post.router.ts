import { Router } from "express";
import { postController } from "./post.controller.js";
import { validate } from "../../middleware/validate.js";
import { PostValidation } from "../../validation/post/post.validation.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const postRouter = Router();

postRouter.post(
    "/",
    requireAuth,
    validate(PostValidation.createPost),
    postController.createPost
);

postRouter.get(
    "/",
    validate(PostValidation.getPosts),
    postController.getPosts
);

postRouter.get(
    "/:postId",
    validate(PostValidation.getPostById),
    postController.getPostById
);

postRouter.get(
    "/author/:authorId",
    validate(PostValidation.getPostsByAuthor),
    postController.getPostsByAuthor
);

postRouter.put(
    "/:postId",
    requireAuth,
    validate(PostValidation.updatePost),
    postController.updatePost
);

postRouter.delete(
    "/:postId",
    requireAuth,
    validate(PostValidation.deletePost),
    postController.deletePost
);
