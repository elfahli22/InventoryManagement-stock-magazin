"use server";

import { authService } from "@/lib/services/auth.service";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid credentials" };
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    await setAuthCookies(result.accessToken, result.refreshToken);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Login failed" };
  }
}

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || "Validation failed" };
  }

  try {
    const result = await authService.register({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    await setAuthCookies(result.accessToken, result.refreshToken);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Registration failed" };
  }
}

export async function logoutAction() {
  await clearAuthCookies();
  revalidatePath("/login");
}
