import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ProtectedRoutesProps {
    children: React.ReactNode;
}

export default function ProtectedRoutes ({children} : ProtectedRoutesProps) {
    const token = localStorage.getItem('token');

    if(!token) {
        toast.error("Vous devrez être connecté pour accéder à cette page.");
        return <Navigate to="/login" replace/>
    }

    return <>{children}</>
}