import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuthProvider = ({ children }) => {
  const { isLogged } = useAuth();
  const location = useLocation();

  if (!isLogged()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuthProvider;
