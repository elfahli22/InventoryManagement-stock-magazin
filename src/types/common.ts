export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortDirection;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export type SortDirection = "asc" | "desc";

export interface SelectOption {
  label: string;
  value: string;
}
