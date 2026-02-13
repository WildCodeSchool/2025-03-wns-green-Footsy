import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../context/userContext";

export default function AdminRoute() {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null; // TO DO : if it is taking too long, we could implement a loading spinner
  }

  if (!user) {
    toast.error("Vous devez être connecté pour accéder à cette page.");
    return <Navigate to="/" replace />;
  }

  if (!user.isAdmin) {
    toast.error("Vous n'avez pas les droits pour accéder à cette page.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
