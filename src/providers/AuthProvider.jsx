import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = useContext.bind({}, AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = ({}, cb) => {
    setUser({
      name: "Not John",
      profileLink: "/users/1",
      picture:
        "https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wildlife-picture.jpg",
      id: 1,
    });
    if (cb) cb();
  };

  const signOut = (cb) => {
    setUser(null);
    if (cb) cb();
  };

  const register = ({}, cb) => {
    setUser({
      name: "Not John",
      profileLink: "#",
      picture:
        "https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wildlife-picture.jpg",
      id: 1,
    });
    if (cb) cb();
  };

  const isLogged = () => user !== null;

  const value = { user, isLogged, signIn, signOut, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
