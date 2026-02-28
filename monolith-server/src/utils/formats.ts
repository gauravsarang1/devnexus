import { SearchParams } from "../types/search-params.js";

export const buildPagination = (
    page: number,
    limit: number,
    total?: number
) => ({
    page,
    limit,
    ...(total !== undefined && {
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
    }),
});

export const parsePaginationParams = (params: SearchParams) => ({
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: params.limit ? parseInt(params.limit, 10) : 10,
});

export const formatUser = (user: any)  => {
        const { photo = [], ...rest } = user ?? {};
        return {
            ...rest,
            avatar: photo[0]?.url ?? null,
        };
    }
