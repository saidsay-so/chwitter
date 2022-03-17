import { useState } from "react";
import NavigationPanel from "./components/NavigationPanel";
import "./MainLayout.css";
import Login from "./pages/Login";
import HomeFeed from "./pages/HomeFeed";

const MainLayout = ({}) => {
  const [user, setUser] = useState({});
  const [connectionState, setConnectionState] = useState(false);

  //TODO: Real authentication
  const authAction = () => setConnectionState(!connectionState);

  const registerAction = (login, password) => {
    authAction();
  };

  const Component = connectionState ? (
    <HomeFeed />
  ) : (
    <Login submitAction={registerAction} />
  );

  return (
    <div className="main-layout">
      <NavigationPanel authAction={authAction} isConnected={connectionState} />
      <main>{Component}</main>
    </div>
  );
};

export default MainLayout;
