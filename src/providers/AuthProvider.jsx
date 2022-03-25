import { createContext, useContext, useState } from "react";
import { fakeUser } from "../services/user";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = ({}, cb) => {
    setUser(fakeUser);
    if (cb) cb();
  };

  const signOut = (cb) => {
    setUser(null);
    if (cb) cb();
  };

  const register = ({}, cb) => {
    setUser(fakeUser);
    if (cb) cb();
  };

  const isLogged = () => user !== null;

  const value = { user, isLogged, signIn, signOut, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
