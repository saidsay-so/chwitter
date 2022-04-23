import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const RequireAuthProvider = ({ children }: { children: JSX.Element }) => {
  const { isLogged, signIn } = useAuth();
  const location = useLocation();
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    signIn(null, () => {
      setIsPending(false);
    });
  }, []);

  if (!isLogged()) {
    if (isPending) return <h1>Veuillez attendre...</h1>;

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuthProvider;
