import { Router } from "express";
import { postController } from "./post.controller.js";
import { validate } from "../../middleware/validate.js";
import { PostValidation } from "./post.validation.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const postRouter = Router();

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
    "/personalized",
    validate(PostValidation.personalizedFeed),
    postController.getPersonalizedFeed
);

postRouter.get(
    "/trending",
    validate(PostValidation.trendingFeed),
    postController.getTrendingFeed
);

postRouter.get(
    "/author/:authorId",
    validate(PostValidation.getPostsByAuthor),
    postController.getPostsByAuthor
);

postRouter.get(
    "/:postId",
    validate(PostValidation.getPostById),
    postController.getPostById
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

export  default postRouter;
