import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "../providers/AuthProvider";
import { IconContext } from "react-icons";
import { useRef } from "react";

const MainLayout = ({}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isConnected = user !== null;
  const authAction = signOut.bind(null, navigate.bind(null, "/login"));

  const refMessageArea = useRef(null);

  const scrollToArea = () => {
    if (refMessageArea.current === null) requestAnimationFrame(scrollToArea);

    //TODO: We should probably use `requestAnimationFrame` here too
    setTimeout(() => {
      refMessageArea.current?.scrollIntoView({
        behavior: "smooth",
      });
      refMessageArea.current?.focus();
    }, 250);
  };

  const createMessage = () => {
    navigate("/");

    requestAnimationFrame(scrollToArea);
  };

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
          <Outlet context={{ refMessageArea }} />
        </main>
      </div>
    </IconContext.Provider>
  );
};

export default MainLayout;
