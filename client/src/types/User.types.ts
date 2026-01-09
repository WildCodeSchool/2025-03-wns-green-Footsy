import type { Avatar } from "./Avatar.types";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  avatar: Avatar;
  isAdmin: boolean;
};
