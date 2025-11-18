import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoutes () {
    const token = localStorage.getItem('token');

    if(!token) {
        toast.error("Vous devrez être connecté pour accéder à cette page.");
        return <Navigate to="/login" replace/>
    }

    return <Outlet />
}