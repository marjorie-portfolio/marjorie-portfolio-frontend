import { Navigate, Outlet } from "react-router-dom";
import useAuthState from "../store/useAuthStore";

export default function ProtectedRoute() {
  const {isAuthenticated} = useAuthState();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}