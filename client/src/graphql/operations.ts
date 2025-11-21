import { gql } from "@apollo/client";
import type { Category, Type } from "../types/ActivityType";

export type LoginMutationData = {
  login: string;
};

export type GetAllCategoriesData = {
  getAllCategories: Category[];
};

export type GetAllTypesData = {
  getTypesByCategoryId: Type[];
}

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

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      title
    }
  }
`;

export const GET_TYPES_BY_CATEGORY = gql`
  query GetTypesByCategoryId($categoryId: Int!) {
    getTypesByCategoryId(categoryId: $categoryId) {
      id
      title
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($data: CreateActivityInput!) {
    createActivity(data: $data) {
      id
      title
      date
      type {
        id
        title
      }
      quantity
      co2_equivalent
      user {
        id
      }
    }
  }
`;