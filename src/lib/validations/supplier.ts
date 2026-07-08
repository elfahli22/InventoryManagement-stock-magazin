import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(1, "Supplier name is required")
    .max(200, "Supplier name must be at most 200 characters"),
  company: z
    .string()
    .max(200, "Company name must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone must be at most 30 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .object({
      street: z.string().max(200).optional().or(z.literal("")),
      city: z.string().max(100).optional().or(z.literal("")),
      state: z.string().max(100).optional().or(z.literal("")),
      zip: z.string().max(20).optional().or(z.literal("")),
      country: z.string().max(100).optional().or(z.literal("")),
    })
    .optional(),
  notes: z
    .string()
    .max(1000, "Notes must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
});

export const updateSupplierSchema = createSupplierSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
