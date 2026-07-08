import type { UserRole } from "@/types/user";

type Permission = "read" | "create" | "update" | "delete" | "adjust";

const PERMISSION_MATRIX: Record<string, Record<Permission, UserRole[]>> = {
  products: {
    read: ["super_admin", "admin", "manager", "staff", "demo"],
    create: ["super_admin", "admin", "manager"],
    update: ["super_admin", "admin", "manager"],
    delete: ["super_admin", "admin"],
    adjust: [] as UserRole[],
  },
  categories: {
    read: ["super_admin", "admin", "manager", "staff", "demo"],
    create: ["super_admin", "admin", "manager"],
    update: ["super_admin", "admin", "manager"],
    delete: ["super_admin", "admin"],
    adjust: [] as UserRole[],
  },
  suppliers: {
    read: ["super_admin", "admin", "manager", "staff", "demo"],
    create: ["super_admin", "admin", "manager"],
    update: ["super_admin", "admin", "manager"],
    delete: ["super_admin", "admin"],
    adjust: [] as UserRole[],
  },
  stock: {
    read: ["super_admin", "admin", "manager", "staff", "demo"],
    create: ["super_admin", "admin", "manager", "staff"],
    adjust: ["super_admin", "admin", "manager"],
    delete: [] as UserRole[],
    update: [] as UserRole[],
  },
  users: {
    read: ["super_admin"],
    create: ["super_admin"],
    update: ["super_admin"],
    delete: ["super_admin"],
    adjust: [] as UserRole[],
  },
  settings: {
    read: ["super_admin", "admin"],
    create: [] as UserRole[],
    update: ["super_admin"],
    delete: [] as UserRole[],
    adjust: [] as UserRole[],
  },
  backup: {
    read: ["super_admin"],
    create: ["super_admin"],
    update: [] as UserRole[],
    delete: ["super_admin"],
    adjust: [] as UserRole[],
  },
  reports: {
    read: ["super_admin", "admin", "manager", "demo"],
    create: ["super_admin", "admin"],
    update: [] as UserRole[],
    delete: [] as UserRole[],
    adjust: [] as UserRole[],
  },
  history: {
    read: ["super_admin", "admin", "manager", "staff", "demo"],
    create: [] as UserRole[],
    update: [] as UserRole[],
    delete: [] as UserRole[],
    adjust: [] as UserRole[],
  },
};

export function hasPermission(
  resource: string,
  action: Permission,
  role: UserRole,
): boolean {
  const resourcePermissions = PERMISSION_MATRIX[resource];
  if (!resourcePermissions) return false;

  const allowedRoles = resourcePermissions[action];
  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
}

export function getAllowedRoles(resource: string, action: Permission): UserRole[] {
  return PERMISSION_MATRIX[resource]?.[action] || [];
}
