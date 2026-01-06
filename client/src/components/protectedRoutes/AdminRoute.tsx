import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../context/userContext";

export default function AdminRoute() {
  const { user } = useCurrentUser();

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
