"use server";

import { authService } from "@/lib/services/auth.service";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/db/models/user.model";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

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

const DEMO_EMAIL = "demo@store.demo";
const DEMO_PASSWORD = "DemoPassword123!";
const DEMO_NAME = "Demo User";

export async function demoLoginAction() {
  try {
    await connectDB();

    let user = await User.findOne({ email: DEMO_EMAIL }).select("+password");

    if (!user) {
      const hashedPassword = await hashPassword(DEMO_PASSWORD);
      user = await User.create({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: hashedPassword,
        role: "demo",
      });
    }

    if (!user.isActive) {
      return { success: false, error: "Demo account is disabled" };
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = await signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = await signRefreshToken({ userId: user._id.toString(), role: user.role });

    await setAuthCookies(accessToken, refreshToken);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Demo login failed" };
  }
}
