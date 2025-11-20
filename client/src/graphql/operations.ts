import { gql } from "@apollo/client";

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

export const GET_ACTIVITY_TYPES = gql`
  query GetActivityTypes {
    getActivityTypes {
      id
      name
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($data: ActivityInput!) {
    createActivity(data: $data) {
      id
      title
      date
      type {
        id
        name
      }
      quantity
      co2_equivalent
      user {
        id
        first_name
        last_name
      }
    }
  }
`;