import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role"); // temporary auth

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;