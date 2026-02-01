import { Save_Type } from "@prisma/client";

export interface SaveToggleInput {
    saveType: Save_Type;
    postId?: string;
    projectId?: string;
}

export interface SaveResponse {
    saved: boolean;
}
