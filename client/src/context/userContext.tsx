import { useQuery } from "@apollo/client/react";
import { createContext, type ReactNode, useContext } from "react";
import {
  GET_CURRENT_USER,
  type GetCurrentUserData,
} from "../graphql/operations";
import { UserSchema, type User } from "../types/User.types";

type UserContextType = {
  user?: User;
  loading: boolean;
  error?: Error | undefined;
  refetch?: () => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  loading: false,
  error: undefined,
  refetch: undefined,
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery<GetCurrentUserData>(
    GET_CURRENT_USER,
    {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    },
  );

  const parsedUser = data?.currentUser
    ? UserSchema.safeParse(data.currentUser)
    : undefined;

  if (parsedUser && !parsedUser.success) {
    console.error("Invalid currentUser payload", parsedUser.error.flatten());
  }

  const user =
    loading || error || !parsedUser
      ? undefined
      : parsedUser.success
        ? parsedUser.data
        : undefined;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  return context;
};
