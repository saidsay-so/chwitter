import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = useContext.bind({}, AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = ({}, cb) => {
    setUser({
      name: "Not John",
      profileLink: "#",
      picture:
        "https://hddesktopwallpapers.in/wp-content/uploads/2015/09/wildlife-picture.jpg",
    });
    if (cb) cb();
  };

  const signOut = (cb) => {
    setUser(null);
    if (cb) cb();
  };

  const value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
