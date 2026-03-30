import { z } from "zod";

export const CreateActivityInputSchema = z.object({
  title: z.string().trim().min(1),
  quantity: z.number().positive().optional(),
  date: z.union([z.string(), z.date()]),
  co2_equivalent: z.number().finite(),
  user_id: z.number().int().positive(),
  type_id: z.number().int().positive(),
});

export const UpdateActivityInputSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).optional(),
  quantity: z.number().positive().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  co2_equivalent: z.number().finite().optional(),
  user_id: z.number().int().positive().optional(),
  type_id: z.number().int().positive().optional(),
});
