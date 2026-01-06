import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../context/userContext";
import { getToken, getUserFromToken } from "../../services/authService";

export default function AdminRoute() {
  const { user } = useCurrentUser();
  const token = getToken();
  const userFromToken = token ? getUserFromToken() : null;

  if (!token && !user) {
    toast.error("Vous devez être connecté pour accéder à cette page.");
    return <Navigate to="/" replace />;
  }

  const isAdmin = user?.isAdmin || userFromToken?.isAdmin;

  if (!isAdmin) {
    toast.error("Vous n'avez pas les droits pour accéder à cette page.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
