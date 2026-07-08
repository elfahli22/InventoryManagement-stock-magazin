import { USER_ROLE } from "@/lib/utils/constants";
import type { UserRole } from "@/types/user";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  manager: 60,
  staff: 40,
  demo: 10,
};

export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === USER_ROLE.SUPER_ADMIN;
}

export function isAdmin(role: UserRole): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN;
}

export function isManager(role: UserRole): boolean {
  return role === USER_ROLE.MANAGER || isAdmin(role);
}
