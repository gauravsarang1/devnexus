
export interface CreatePostDTO {
    content: string;
    authorId: string;

    mentionsOnPost?: {
        userId?: string;
        projectId?: string;
    }[];
}

export interface PostResponse {
    id: string;
    content: string;

    author: {
        id: string;
        uId: string;
        name: string;
        avatar: string | null;
    };

    createdAt: Date;
    updatedAt: Date;

    mentions: {
        id: string;
        mentionType: string;

        user: {
            id: string;
            uId: string;
            name: string;
            avatar: string | null;
        } | null;

        project: {
            id: string;
            title: string;
            slug: string;
            logo: string | null;
        } | null;
    }[];
}
