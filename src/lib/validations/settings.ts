import { z } from "zod";

export const updateSettingsSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .max(200, "Store name must be at most 200 characters"),
  storeEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  storePhone: z
    .string()
    .max(30, "Phone must be at most 30 characters")
    .optional()
    .or(z.literal("")),
  storeAddress: z
    .string()
    .max(500, "Address must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .default("USD"),
  currencySymbol: z
    .string()
    .length(1, "Currency symbol must be 1 character")
    .default("$"),
  taxRate: z
    .number()
    .min(0, "Tax rate must be 0 or greater")
    .max(100, "Tax rate must be at most 100")
    .default(0),
  lowStockThreshold: z
    .number()
    .int()
    .min(0, "Low stock threshold must be 0 or greater")
    .default(10),
  timezone: z.string().default("UTC"),
  dateFormat: z.string().default("MM/dd/yyyy"),
  notifications: z.object({
    lowStock: z.boolean().default(true),
    dailyReport: z.boolean().default(false),
  }),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
