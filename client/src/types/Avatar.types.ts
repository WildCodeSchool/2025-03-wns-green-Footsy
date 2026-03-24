import { z } from "zod";

export type Avatar = {
  id: number;
  title: string;
  image: string;
};

export const AvatarSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  image: z.string().trim().min(1),
});
