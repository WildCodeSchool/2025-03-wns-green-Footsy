import Activity from "../entities/Activity";
import Avatar from "../entities/Avatar";
import Category from "../entities/Category";
import type Interaction from "../entities/Interaction";
import Type from "../entities/Type";
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

export const createMockCategory = ({
  id,
  title,
  types,
}: {
  id?: number;
  title?: string;
  types?: Type[];
} = {}): Category => {
  const category = new Category();
  category.id = id ?? 1;
  category.title = title ?? "Transport";
  category.types = types ?? [];
  return category;
};

export const createMockType = ({
  id,
  title,
  quantity_unit,
  category_id,
  category,
  activities,
}: {
  id?: number;
  title?: string;
  quantity_unit?: string;
  category_id?: number;
  category?: Category;
  activities?: Activity[];
} = {}): Type => {
  const type = new Type();
  type.id = id ?? 1;
  type.title = title ?? "Car";
  type.quantity_unit = quantity_unit ?? "km";
  type.category_id = category_id ?? 1;
  type.category = category ?? createMockCategory();
  type.activities = activities ?? [];
  return type;
};

export const createMockActivity = ({
  id,
  title,
  quantity,
  date,
  co2_equivalent,
  user,
  type,
  interactions,
}: {
  id?: number;
  title?: string;
  quantity?: number;
  date?: Date;
  co2_equivalent?: number;
  user?: User;
  type?: Type;
  interactions?: Interaction[];
} = {}): Activity => {
  const activity = new Activity();
  activity.id = id ?? 1;
  activity.title = title ?? "Trip to work";
  activity.quantity = quantity ?? 10.5;
  activity.date = date ?? new Date("2024-01-15");
  activity.co2_equivalent = co2_equivalent ?? 2.5;
  activity.user = user ?? createMockUser();
  activity.type = type ?? createMockType();
  activity.interactions = interactions ?? [];
  return activity;
};
