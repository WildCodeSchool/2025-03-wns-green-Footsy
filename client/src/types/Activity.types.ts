import { z } from "zod";

export type Category = {
  id: number;
  title: string;
  quantity_unit: string;
};

export type Type = {
  id: number;
  title: string;
  ecv: number;
  category: Category;
};

export type Activity = {
  id: number;
  title: string;
  quantity?: number;
  date: string;
  co2_equivalent: number;
  userId: number;
  type: Type;
};

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  quantity_unit: z.string().trim().min(1),
});

export const TypeSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  ecv: z.number().finite(),
  category: CategorySchema,
});

export const ActivitySchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  quantity: z.number().finite().optional(),
  date: z.string().trim().min(1),
  co2_equivalent: z.number().finite(),
  userId: z.number().int().positive(),
  type: TypeSchema,
});
