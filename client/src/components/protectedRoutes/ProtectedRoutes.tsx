import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../context/userContext";
import { getToken } from "../../services/authService";

export default function ProtectedRoutes() {
  const { user } = useCurrentUser();
  const token = getToken();

  if (!token && !user) {
    toast.error("Vous devez être connecté pour accéder à cette page.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
