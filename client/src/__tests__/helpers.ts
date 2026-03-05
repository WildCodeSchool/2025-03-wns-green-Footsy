import { vi } from "vitest";
import type { SignUpFormData } from "../services/signUpForm.services";
import type { Avatar } from "../types/Avatar.types";
import type { Activity, Category, Type } from "../types/Activity.types";

export const createMockCategory = ({
  id,
  title,
  quantity_unit,
}: Partial<Category> = {}): Category => {
  return {
    id: id ?? 1,
    title: title ?? "Transport",
    quantity_unit: quantity_unit ?? "vol",
  };
};

export const createMockType = ({
  id,
  title,
  category,
  ecv,
}: Partial<Type> = {}): Type => {
  return {
    id: id ?? 1,
    title: title ?? "Vol court-courrier",
    category: category ?? createMockCategory(),
    ecv: ecv ?? 1,
  };
};

export const createMockActivity = ({
  id,
  title,
  quantity,
  date,
  co2_equivalent,
  userId,
  type,
}: Partial<Activity> = {}): Activity => {
  return {
    id: id ?? 1,
    title: title ?? "Activité test",
    quantity: quantity ?? 1,
    date: date ?? "2025-03-15",
    co2_equivalent: co2_equivalent ?? 100,
    userId: userId ?? 1,
    type: type ?? createMockType(),
  };
};

export const createMockAvatar = ({
  id,
  title,
  image,
}: {
  id?: number;
  title?: string;
  image?: string;
} = {}): Avatar => {
  return {
    id: id ?? 1,
    title: title ?? "Default Avatar",
    image: image ?? "avatar.jpg",
  };
};

export const createMockUserFormData = ({
  name,
  surname,
  birthdate,
  email,
  confirmEmail,
  password,
  confirmPassword,
  avatar,
}: SignUpFormData = {}): SignUpFormData => {
  return {
    name: name ?? "Jane",
    surname: surname ?? "Doe",
    birthdate: birthdate ?? "1990-08-04",
    email: email ?? "jane.doe@example.com",
    confirmEmail: confirmEmail ?? "jane.doe@example.com",
    password: password ?? "password123",
    confirmPassword: confirmPassword ?? "password123",
    avatar: avatar ?? createMockAvatar(),
  };
};

export const createMockInputEvent = (name: string, value: string) => {
  return {
    target: { id: name, name, value },
    currentTarget: { id: name, name, value },
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

export const createMockFormEvent = (): React.FormEvent<HTMLFormElement> => {
  return {
    preventDefault: vi.fn(),
  } as unknown as React.FormEvent<HTMLFormElement>;
};
