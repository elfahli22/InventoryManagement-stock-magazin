import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const ACCESS_TOKEN_NAME = "access_token";

const publicPaths = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
];

const protectedPaths = [
  "/dashboard",
  "/products",
  "/categories",
  "/suppliers",
  "/stock",
  "/history",
  "/reports",
  "/users",
  "/settings",
  "/profile",
  "/backup",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`[MIDDLEWARE] pathname=${pathname}`);

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isApiProtected = pathname.startsWith("/api/") && !isPublic;

  if (isPublic) {
    console.log(`[MIDDLEWARE] PUBLIC path — passing through`);
    return NextResponse.next();
  }

  if (isProtected || isApiProtected) {
    const cookie = request.cookies.get(ACCESS_TOKEN_NAME);
    console.log(`[MIDDLEWARE] cookie "access_token":`, cookie?.value ? `EXISTS (length=${cookie.value.length})` : `MISSING`);

    const token = cookie?.value;

    if (!token) {
      console.log(`[MIDDLEWARE] BLOCK — no access_token cookie found`);
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
          { status: 401 },
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      console.log(`[MIDDLEWARE] Calling verifyToken() with token length=${token.length}`);
      const payload = await verifyToken(token);
      console.log(`[MIDDLEWARE] verifyToken() returned:`, payload ? `VALID (userId=${payload.userId})` : `NULL`);
      if (!payload) {
        console.log(`[MIDDLEWARE] BLOCK — verifyToken returned null (expired or invalid)`);
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, error: { code: "UNAUTHORIZED", message: "Token expired" } },
            { status: 401 },
          );
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", payload.role);

      console.log(`[MIDDLEWARE] ALLOW — forwarding to ${pathname} for userId=${payload.userId}`);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (err) {
      console.log(`[MIDDLEWARE] CRASH — unexpected error in verifyToken:`, err);
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: { code: "UNAUTHORIZED", message: "Token verification error" } },
          { status: 401 },
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  console.log(`[MIDDLEWARE] UNMATCHED path — passing through`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
