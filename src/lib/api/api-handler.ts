import { NextRequest, NextResponse } from "next/server";
import { getSession, refreshSession, type JwtUserPayload } from "@/lib/auth/session";
import { AppError } from "./api-error";
import { serverErrorResponse, unauthorizedResponse } from "./api-response";
import { logger } from "@/lib/utils/logger";

type ApiHandler<T = unknown> = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>>; session: JwtUserPayload },
) => Promise<NextResponse<T>>;

interface RouteConfig {
  auth?: boolean;
  roles?: string[];
}

export function apiHandler<T>(handler: ApiHandler<T>, config?: RouteConfig) {
  return async (req: NextRequest, { params }: { params: Promise<Record<string, string>> }) => {
    try {
      if (config?.auth) {
        let session = await getSession();
        if (!session) {
          session = await refreshSession();
        }
        if (!session) {
          return unauthorizedResponse();
        }

        if (config?.roles && config.roles.length > 0) {
          if (!config.roles.includes(session.role)) {
            return NextResponse.json(
              { success: false, error: { code: "FORBIDDEN", message: "Forbidden" } },
              { status: 403 },
            );
          }
        }

        return handler(req, { params, session });
      }

      return handler(req, {
        params,
        session: { userId: "", role: "" },
      });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          },
          { status: error.statusCode },
        );
      }

      logger.error("Unhandled API error", { error: String(error) });
      return serverErrorResponse(error);
    }
  };
}
