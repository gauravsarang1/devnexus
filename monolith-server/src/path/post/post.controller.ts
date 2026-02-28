import { Request, Response, NextFunction } from "express";
import { PostService } from "./post.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const postController = {
    createPost: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorId = req.userId!;
            const body = req.validated!.body!;

            const data = await PostService.createPost({
                ...body,
                authorId
            });

            return successResponse(res, data, "Post created successfully");
        } catch (error) {
            next(error);
        }
    },

    getPostById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { postId } = req.validated!.params!;

            const data = await PostService.findById(postId);
            return successResponse(res, data, "Post fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    getPostsByAuthor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authorId } = req.validated!.params!;
            const query = req.validated!.query!;

            const data = await PostService.findByAuthorId({
                authorId,
                ...query
            });

            return successResponse(res, data, "Author posts fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    getPosts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.validated!.query!;

            const data = await PostService.getGlobalFeed(query);
            return successResponse(res, data, "Posts fetched successfully");
        } catch (error) {
            next(error);
        }
    },

    getPersonalizedFeed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await PostService.getPersonalizedFeed(
                req.userId!,
                req.validated!.query!
            );
            return successResponse(res, data, "Personalized feed fetched");
        } catch (e) {
            next(e);
        }
    },

    getTrendingFeed: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await PostService.getTrendingFeed(req.validated!.query!);
            return successResponse(res, data, "Trending posts fetched");
        } catch (e) {
            next(e);
        }
    },

    updatePost: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorId = req.userId!;
            const { postId } = req.validated!.params!;
            const body = req.validated!.body!;

            const data = await PostService.updatePost(
                postId,
                authorId,
                body
            );

            return successResponse(res, data, "Post updated successfully");
        } catch (error) {
            next(error);
        }
    },

    deletePost: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorId = req.userId!;
            const { postId } = req.validated!.params!;

            await PostService.deletePost(postId, authorId);
            return successResponse(res, null, "Post deleted successfully");
        } catch (error) {
            next(error);
        }
    }
};
