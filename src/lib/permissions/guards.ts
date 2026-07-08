import { hasPermission } from "./permissions";
import type { UserRole } from "@/types/user";
import {
  AuthorizationError,
  AuthenticationError,
} from "@/lib/api/api-error";
import type { JwtUserPayload } from "@/lib/auth/jwt";

export function guardDemo(session: JwtUserPayload | null): string | null {
  if (session?.role === "demo") {
    return "Demo accounts cannot perform this action";
  }
  return null;
}

export function guardPermission(
  role: UserRole | undefined | null,
  resource: string,
  action: "read" | "create" | "update" | "delete" | "adjust",
): void {
  if (!role) {
    throw new AuthenticationError();
  }

  if (!hasPermission(resource, action, role)) {
    throw new AuthorizationError(
      `You don't have permission to ${action} ${resource}`,
    );
  }
}

export function guardRole(
  role: UserRole | undefined | null,
  allowedRoles: UserRole[],
): void {
  if (!role) {
    throw new AuthenticationError();
  }

  if (!allowedRoles.includes(role)) {
    throw new AuthorizationError("You don't have permission to perform this action");
  }
}
