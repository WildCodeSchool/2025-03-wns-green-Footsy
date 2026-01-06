import type { TagVariant } from "../components/tag/Tag";
import type { User } from "../types/User.types";

export const getUserStatusBadge = (
  user: User
): { label: string; variant: TagVariant } => {
  return user.isAdmin
    ? { label: "Admin", variant: "dark" }
    : { label: "Utilisateur", variant: "light" };
};
