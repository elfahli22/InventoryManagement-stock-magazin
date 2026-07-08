import { z } from "zod";
import { objectIdSchema } from "./common";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  parent: objectIdSchema.optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
