export interface BaseApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

/**
 * Using type alias instead of interface to support mapped types [K in Key]
 */
export type PaginatedData<T, Key extends string> = {
  [K in Key]: T[];
} & { pagination: Pagination };

export type PaginatedResponse<T, Key extends string> = BaseApiResponse<PaginatedData<T, Key>>;
