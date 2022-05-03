import { useNavigate, useSearchParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "../providers/AuthProvider";
import { IconContext } from "react-icons";
import { MutableRefObject, useRef } from "react";

export interface MainLayoutOutlet {
  refMessageArea: MutableRefObject<HTMLTextAreaElement>;
}

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isConnected = user !== null;
  const authAction = signOut.bind(null, () => navigate("/login"));

  const refMessageArea = useRef<HTMLTextAreaElement>(null);

  const [searchParams, _] = useSearchParams();

  const scrollToArea = () => {
    if (refMessageArea.current === null) requestAnimationFrame(scrollToArea);

    requestAnimationFrame(() => {
      refMessageArea.current?.scrollIntoView({
        behavior: "smooth",
      });
      refMessageArea.current?.focus();
    });
  };

  const createMessage = () => {
    navigate("/");
    requestAnimationFrame(scrollToArea);
  };

  const search = (search: string) => {
    const params = new URLSearchParams({ search });
    navigate({ pathname: "/search", search: params.toString() });
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
            search={search}
            initialSearch={searchParams.get("search") ?? undefined}
            profileLink={user.profileLink}
            homePage="/"
            signOut={authAction}
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
