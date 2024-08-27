import { useNavigate, useSearchParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "../providers/AuthProvider";
import { IconContext } from "react-icons";
import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "../providers/ColorSchemeProvider";

export interface MainLayoutOutlet {
  refMessageArea: MutableRefObject<HTMLTextAreaElement>;
}

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isConnected = user !== null;
  const logout = signOut.bind(null, () => navigate("/login"));

  const refMessageArea = useRef<HTMLTextAreaElement>(null);

  const [search, setSearch] = useState("");
  const [searchParams, _] = useSearchParams();

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const scrollToArea = () => {
    if (refMessageArea.current === null) requestAnimationFrame(scrollToArea);

    requestAnimationFrame(() => {
      refMessageArea.current?.scrollIntoView({
        behavior: "smooth",
      });
      refMessageArea.current?.focus();
    });
  };

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearch(query);
    }
  }, [searchParams]);

  const createMessage = () => {
    navigate("/");
    requestAnimationFrame(scrollToArea);
  };

  const searchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <NavigationPanel
          user={user}
          search={search}
          switchColorScheme={toggleColorScheme}
          colorScheme={colorScheme}
          onSearchInput={(e) => {
            e.preventDefault();
            setSearch((e.target as HTMLInputElement).value);
          }}
          onSearchSubmit={searchSubmit}
          homePage="/"
          signOut={logout}
          createMessage={createMessage}
        />

        <main>
          <Outlet context={{ refMessageArea }} />
        </main>
      </div>
    </IconContext.Provider>
  );
};

export default MainLayout;
