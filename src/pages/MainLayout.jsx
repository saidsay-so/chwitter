import { useState } from "react";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import Register from "./Register";

const MainLayout = ({}) => {
  const [connectionState, setConnectionState] = useState(false);

  //TODO: Real authentication
  const authAction = () => setConnectionState(!connectionState);

  const Component = connectionState ? Register : Register;

  return (
    <main className="main-layout">
      <NavigationPanel authAction={authAction} isConnected={connectionState} />
      <Component />
    </main>
  );
};

export default MainLayout;
