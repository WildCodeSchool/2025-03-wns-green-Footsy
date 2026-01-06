import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../context/userContext";

export default function GuestRoute() {
  const { user } = useCurrentUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
