import apiClient from "./apiClient";
import { unwrap } from "../utils/apiHelper";
import {
    BaseApiResponse,
    PaginatedResponse,
} from "../utils/apiResponse";
import { Project } from "../types";

/* ---------------- Types ---------------- */

export type ProjectPaginatedResponse =
    PaginatedResponse<Project, "projects">;

export type ProjectResponse = BaseApiResponse<Project>;

export type CreateProjectInput = {
    title: string;
    description: string;
    slug: string;
    tagline?: string;
    githubUrl?: string;
    previewUrl?: string;
    skillIds?: string[];
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ProjectFeedParams = {
    page?: number;
    limit?: number;
    search?: number;
};

/* ---------------- Service ---------------- */

export const projectService = {
    /* -------- Feeds -------- */

    getAllProjects: async (
        params: ProjectFeedParams = {}
    ): Promise<ProjectPaginatedResponse["data"]> => {
        const res = await apiClient.get<ProjectPaginatedResponse>(
            "/projects",
            { params }
        );

        return res.data.data;
    },

    getPersonalizedFeed: async (
        params: ProjectFeedParams = {}
    ): Promise<ProjectPaginatedResponse["data"]> => {
        const res = await apiClient.get<ProjectPaginatedResponse>(
            "/projects/feed/personalized",
            { params }
        );

        return res.data.data;
    },

    getTrendingProjects: async (
        params: ProjectFeedParams = {}
    ): Promise<ProjectPaginatedResponse["data"]> => {
        const res = await apiClient.get<ProjectPaginatedResponse>(
            "/projects/feed/trending",
            { params }
        );

        return res.data.data;
    },

    /* -------- Queries -------- */

    getProjectById: async (projectId: string): Promise<Project> =>
        unwrap(
            await apiClient.get<ProjectResponse>(
                `/projects/${projectId}`
            )
        ),

    getProjectBySlug: async (slug: string): Promise<Project> =>
        unwrap(
            await apiClient.get<ProjectResponse>(
                `/projects/slug/${slug}`
            )
        ),

    getProjectsByUser: async (
        userId: string,
        params: ProjectFeedParams = {}
    ): Promise<ProjectPaginatedResponse["data"]> => {
        const res = await apiClient.get<ProjectPaginatedResponse>(
            `/projects/user/${userId}`,
            { params }
        );

        return res.data.data;
    },

    /* -------- Mutations -------- */

    createProject: async (
        data: CreateProjectInput
    ): Promise<Project> =>
        unwrap(
            await apiClient.post<ProjectResponse>(
                "/projects",
                data
            )
        ),

    updateProject: async (
        projectId: string,
        data: UpdateProjectInput
    ): Promise<Project> =>
        unwrap(
            await apiClient.put<ProjectResponse>(
                `/projects/${projectId}`,
                data
            )
        ),

    deleteProject: async (
        projectId: string
    ): Promise<{ success: true }> =>
        unwrap(
            await apiClient.delete<
                BaseApiResponse<{ success: true }>
            >(`/projects/${projectId}`)
        ),
};
