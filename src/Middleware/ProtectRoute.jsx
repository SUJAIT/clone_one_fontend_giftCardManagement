import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct way


const RoleRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    return role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default RoleRoute;
