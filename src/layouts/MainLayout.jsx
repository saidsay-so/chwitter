import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "../providers/AuthProvider";
import { IconContext } from "react-icons";

const MainLayout = ({}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isConnected = user !== null;
  const authAction = signOut.bind(null, navigate.bind(null, "/login"));
  const createMessage = () =>
    navigate({
      pathname: "/",
      hash: "#search",
    });

  return (
    <IconContext.Provider
      value={{
        className: "react-icon",
      }}
    >
      <div className="main-layout">
        {isConnected && (
          <NavigationPanel
            {...user}
            homePage="/"
            signOut={authAction}
            isConnected={isConnected}
            createMessage={createMessage}
          />
        )}
        <main>
          <Outlet />
        </main>
      </div>
    </IconContext.Provider>
  );
};

export default MainLayout;
