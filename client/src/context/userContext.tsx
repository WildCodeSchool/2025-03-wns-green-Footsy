import { useQuery } from "@apollo/client/react";
import { createContext, type ReactNode, useContext } from "react";
import {
  GET_CURRENT_USER,
  type GetCurrentUserData,
} from "../graphql/operations";
import type { User } from "../types/User.types";

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

  const user = loading ? undefined : error ? undefined : data?.currentUser;

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
