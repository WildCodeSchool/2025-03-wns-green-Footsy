import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../context/userContext";
import { getToken } from "../../services/authService";

export default function GuestRoute() {
  const { user } = useCurrentUser();
  const token = getToken();

  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
