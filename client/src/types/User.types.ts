import { z } from "zod";

import type { Avatar } from "./Avatar.types";
import { AvatarSchema } from "./Avatar.types";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  avatar: Avatar;
  isAdmin: boolean;
};

export const UserSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().trim().email(),
  birthdate: z.string().trim().min(1),
  avatar: AvatarSchema,
  isAdmin: z.boolean(),
});
