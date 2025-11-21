import { gql } from "@apollo/client";
import type { User } from "../types/User.types";

export type LoginMutationData = {
  login: string;
};

export type GetCurrentUserData = {
  user: User;
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
      birthdate
      avatar {
        id
        title
        image
      }
    }
  }
`;
