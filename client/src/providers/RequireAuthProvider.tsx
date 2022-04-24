import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
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
    if (isPending)
      return (
        <div>
          <LoadingPlaceholder />
        </div>
      );

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuthProvider;
