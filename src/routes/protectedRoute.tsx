import { Navigate, Outlet } from "react-router-dom";
import useAuthState from "../store/useAuthStore";

export default function ProtectedRoute() {
  const { isAuthenticated, isSessionRestored } = useAuthState();

  if (!isSessionRestored) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isSessionRestored } = useAuthState();

  if (!isSessionRestored) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}