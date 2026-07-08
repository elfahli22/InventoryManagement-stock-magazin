"use server";

import { categoryService } from "@/lib/services/category.service";
import { createCategorySchema, updateCategorySchema } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";
import { guardDemo } from "@/lib/permissions/guards";

export async function createCategoryAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    parent: formData.get("parent") as string,
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };

  const parsed = createCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const category = await categoryService.create(parsed.data);
    revalidatePath("/categories");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create category" };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    parent: formData.get("parent") as string,
    sortOrder: Number(formData.get("sortOrder")) || undefined,
  };

  const parsed = updateCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const category = await categoryService.update(id, parsed.data);
    revalidatePath("/categories");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  try {
    await categoryService.delete(id);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete category" };
  }
}
