import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ agentOnly = false, clientOnly = false }) {
  const { user, isAgent, isClient } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if ((agentOnly && !isAgent) || (clientOnly && !isClient)) {
    return <Navigate to="/pedidos" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
