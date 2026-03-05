import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../context/userContext";

export default function GuestRoute() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null; // TO DO : if it is taking too long, we could implement a loading spinner
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
