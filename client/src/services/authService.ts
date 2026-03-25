import { z } from "zod";

import { AvatarSchema } from "../types/Avatar.types";

const loginUserProfileSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  mail: z.string().trim().email(),
  birthDate: z.string().or(z.date()),
  avatar: AvatarSchema,
  isAdmin: z.boolean(),
});

export const parseLoginResponse = (response: string) => {
  try {
    // Parse user data (it's JSON stringified)
    const parsedJson: unknown = JSON.parse(response);
    const user = loginUserProfileSchema.parse(parsedJson);
    return { user };
  } catch (error) {
    console.error("Error parsing login response:", error);
    throw new Error("Failed to parse login response");
  }
};
