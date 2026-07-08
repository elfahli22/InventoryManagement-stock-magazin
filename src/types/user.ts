import type { USER_ROLE } from "@/lib/utils/constants";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  isActive?: boolean;
  avatar?: string;
}
