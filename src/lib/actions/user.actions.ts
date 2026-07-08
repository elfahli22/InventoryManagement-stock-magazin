"use server";

import { userService } from "@/lib/services/user.service";
import { createUserSchema, updateUserSchema, updateProfileSchema, changePasswordSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";

export async function createUserAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as "super_admin" | "admin" | "manager" | "staff",
    phone: formData.get("phone") as string,
  };

  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await userService.create(parsed.data);
    revalidatePath("/users");
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as "super_admin" | "admin" | "manager" | "staff",
    phone: formData.get("phone") as string,
    isActive: formData.get("isActive") === "true",
  };

  const parsed = updateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await userService.update(id, parsed.data);
    revalidatePath("/users");
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" };
  }
}

export async function deleteUserAction(id: string) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await userService.delete(id);
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" };
  }
}

export async function updateProfileAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
  };

  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await userService.updateProfile(session.userId, parsed.data);
    revalidatePath("/profile");
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" };
  }
}

export async function changePasswordAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Validation failed" };
  }

  try {
    await userService.changePassword(session.userId, parsed.data.currentPassword, parsed.data.newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to change password" };
  }
}
