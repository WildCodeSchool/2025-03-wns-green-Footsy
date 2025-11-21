import { useEffect } from "react";
import { getToken, removeToken } from "../../services/authService";

export default function Dashboard() {
  useEffect(() => {
    // Check if user has token, redirect to login if not
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
