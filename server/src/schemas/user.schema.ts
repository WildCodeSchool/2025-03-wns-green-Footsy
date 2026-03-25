import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const BirthdateSchema = z
  .union([z.string(), z.date()])
  .transform((val) => (val instanceof Date ? val : new Date(val)));

export const AvatarSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  image: z.string().trim().min(1),
});

export const NewUserInputSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8).regex(PASSWORD_REGEX),
  birthdate: BirthdateSchema,
  avatar: AvatarSchema,
});

export type NewUserServiceInput = z.infer<typeof NewUserInputSchema>;

export const UserInputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const UpdatePersonalInfoInputSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  birthdate: BirthdateSchema,
});

export type UpdatePersonalInfoServiceInput = z.infer<
  typeof UpdatePersonalInfoInputSchema
>;

export const ChangePasswordInputSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(PASSWORD_REGEX),
});
