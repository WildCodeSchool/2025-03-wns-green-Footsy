import { useQuery } from "@apollo/client/react";
import { createContext, type ReactNode, useContext } from "react";
import {
  GET_CURRENT_USER,
  type GetCurrentUserData,
} from "../graphql/operations";
import { getUserFromToken } from "../services/authService";
import type { User } from "../types/User.types";

type UserContextType = {
  user?: User;
  loading: boolean;
  error?: any;
  refetch?: () => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  loading: false,
  error: undefined,
  refetch: undefined,
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refetch } = useQuery<{ currentUser: User }>(
    GET_CURRENT_USER,
    {
      errorPolicy: "all",
      fetchPolicy: "network-only",
    }
  );

  const user =
    loading ? getUserFromToken() ?? undefined : error ? undefined : data?.currentUser;

  return (
    <UserContext.Provider value={{
      user,
      loading,
      error,
      refetch
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  return context;
};
