import { gql } from "@apollo/client";
import type { Activity, Category } from "../types/Activity.types";
import type { User } from "../types/User.types";

export type GetActivitiesByUserIdData = {
  getActivitiesByUserId: Activity[];
};

export type GetAllCategoriesData = {
  getAllCategories: Category[];
};

export type GetCurrentUserData = {
  currentUser: User;
};

export type LoginMutationData = {
  login: string;
};

export const SIGN_UP = gql`
  mutation SignUp($data: NewUserInput!) {
    signup(data: $data)
  }
`;

export const GET_ALL_AVATARS = gql`
  query GetAllAvatars {
    getAllAvatars {
      id
      title
      image
    }
  }
`;

export const LOGIN = gql`
  mutation Login($data: UserInput!) {
    login(data: $data)
  }
`;

export const GET_ACTIVITIES_BY_USER_ID = gql`
  query GetActivitiesByUserId($userId: Int!) {
    getActivitiesByUserId(userId: $userId) {
      id
      title
      date
      quantity
      co2_equivalent
      type {
        id
        title
        quantity_unit
        category {
          id
          title
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      title
    }
  }
`;
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      first_name
      last_name
      email
      birthdateString
      isAdmin
      avatar {
        id
        title
        image
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      first_name
      last_name
      email
      birthdate
      isAdmin
      avatar {
        id
        title
        image
      }
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
  mutation UpdatePersonalInfo($userId: Int!, $data: UpdatePersonalInfoInput!) {
    updatePersonalInfo(userId: $userId, data: $data) {
      id
      first_name
      last_name
      birthdateString
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($userId: Int!, $data: UpdateAvatarInput!) {
    updateAvatar(userId: $userId, data: $data) {
      id
      avatar {
        id
        title
        image
      }
    }
  }
`;

export const DELETE_USER_BY_ADMIN = gql`
  mutation DeleteUserByAdmin($userId: Int!) {
    deleteUserByAdmin(userId: $userId)
  }
`;

export const TOGGLE_USER_ADMIN_STATUS = gql`
  mutation ToggleUserAdminStatus($userId: Int!) {
    toggleUserAdminStatus(userId: $userId) {
      id
      first_name
      last_name
      email
      isAdmin
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($userId: Int!, $data: ChangePasswordInput!) {
    changePassword(userId: $userId, data: $data)
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($userId: Int!) {
    deleteAccount(userId: $userId)
  }
`;
