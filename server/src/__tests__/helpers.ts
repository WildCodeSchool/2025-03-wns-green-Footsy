import Avatar from "../entities/Avatar";
import User from "../entities/User";

export const createMockAvatar = ({
  id,
  title,
  image,
  users,
}: {
  id?: number;
  title?: string;
  image?: string;
  users?: User[];
} = {}): Avatar => {
  const avatar = new Avatar();
  avatar.id = id ?? 1;
  avatar.title = title ?? "Default Avatar";
  avatar.image = image ?? "avatar.jpg";
  avatar.users = users ?? [];
  return avatar;
};

export const createMockUser = ({
  id,
  email,
  first_name,
  last_name,
  birthdate,
  hashed_password,
  avatar,
}: {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  birthdate?: Date;
  hashed_password?: string;
  avatar?: Avatar;
} = {}): User => {
  const user = new User();
  user.id = id ?? 1;
  user.email = email ?? "test@example.com";
  user.first_name = first_name ?? "Jane";
  user.last_name = last_name ?? "Doe";
  user.birthdate = birthdate ?? new Date("1990-08-04");
  user.hashed_password = hashed_password ?? "hashedPassword123";
  user.avatar = avatar ?? createMockAvatar();
  return user;
};
