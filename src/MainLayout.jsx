import { useState } from "react";
import NavigationPanel from "./components/NavigationPanel";
import "./MainLayout.css";
import Register from "./pages/Register";

const MainLayout = ({}) => {
  const [connectionState, setConnectionState] = useState(false);

  //TODO: Real authentication
  const authAction = () => setConnectionState(!connectionState);

  const Component = connectionState ? <Register /> : <Register />;

  return (
    <div className="main-layout">
      <NavigationPanel authAction={authAction} isConnected={connectionState} />
      <main>{Component}</main>
    </div>
  );
};

export default MainLayout;
