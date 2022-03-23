import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "../providers/AuthProvider";

const MainLayout = ({}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isConnected = user !== null;
  const authAction = signOut.bind(null, navigate.bind(null, "/login"));

  return (
    <div className="main-layout">
      {isConnected && (
        <NavigationPanel
          {...user}
          homePage="/"
          signOut={authAction}
          isConnected={isConnected}
        />
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
