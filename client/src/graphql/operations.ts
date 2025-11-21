import { gql } from "@apollo/client";
import type { User } from "../types/User.types";

export type LoginMutationData = {
  login: string;
};

export type GetCurrentUserData = {
  currentUser: User;
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

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      first_name
      last_name
      email
      birthdateString
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
