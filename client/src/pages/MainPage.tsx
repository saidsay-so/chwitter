import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import HomeFeed from "./HomeFeed";

export default function MainPage() {
  const { isLogged } = useAuth();
  const location = useLocation();

  const Page = !isLogged() ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    <HomeFeed />
  );

  return Page;
}
