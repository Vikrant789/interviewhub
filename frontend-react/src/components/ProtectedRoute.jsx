import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

//   if (!user && !localStorage.getItem("token")) {
//   return <Navigate to="/login" />;
// }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;