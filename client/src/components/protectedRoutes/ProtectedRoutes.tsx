import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../context/userContext";

export default function ProtectedRoutes() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
