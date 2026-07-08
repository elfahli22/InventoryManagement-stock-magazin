import type { PaginationMeta, SortDirection } from "@/types/common";
import { config } from "@/config";

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export function parsePagination(params: {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  order?: string;
}): ParsedPagination {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, Number(params.limit) || config.pagination.defaultLimit),
  );
  const order: SortDirection = params.order === "asc" ? "asc" : "desc";
  const sortField = params.sort || "createdAt";
  const sort: Record<string, 1 | -1> = { [sortField]: order === "asc" ? 1 : -1 };

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort,
  };
}

export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
