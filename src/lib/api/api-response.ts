import { NextResponse } from "next/server";
import type { ApiResponse, PaginatedResponse, PaginationMeta } from "@/types/common";

export function successResponse<T>(data: T, meta?: Record<string, unknown>): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, meta },
    { status: 200 },
  );
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    pagination,
  });
}

export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: code || "ERROR",
        message,
        details,
      },
    },
    { status },
  );
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse(message, 401, "UNAUTHORIZED");
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse> {
  return errorResponse(message, 403, "FORBIDDEN");
}

export function notFoundResponse(message = "Not found"): NextResponse<ApiResponse> {
  return errorResponse(message, 404, "NOT_FOUND");
}

export function conflictResponse(message = "Resource already exists"): NextResponse<ApiResponse> {
  return errorResponse(message, 409, "CONFLICT");
}

export function validationErrorResponse(
  details: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return errorResponse("Validation failed", 400, "VALIDATION_ERROR", details);
}

export function serverErrorResponse(error?: unknown): NextResponse<ApiResponse> {
  const message = process.env.NODE_ENV === "development" && error instanceof Error
    ? error.message
    : "Internal server error";
  return errorResponse(message, 500, "INTERNAL_ERROR");
}
