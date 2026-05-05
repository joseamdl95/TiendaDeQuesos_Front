import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  const token = localStorage.getItem("token");

  if (token && loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}