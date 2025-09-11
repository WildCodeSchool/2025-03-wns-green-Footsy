import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp($data: NewUserInput!) {
    signup(data: $data)
  }
`;
