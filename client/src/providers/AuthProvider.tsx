import { LoginParams, RegisterParams } from "common";
import { createContext, ReactNode, useContext, useState } from "react";
import { fakeUser, User } from "../services/user";

interface Context {
  user: User | null;
  isLogged: () => boolean;
  signIn: (l: LoginParams, cb: VoidFunction) => void;
  signOut: (cb: VoidFunction) => void;
  register: (r: RegisterParams, cb: VoidFunction) => void;
}

const AuthContext = createContext<Context>({} as Context);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = ({}, cb: VoidFunction) => {
    setUser(fakeUser);
    if (cb) cb();
  };

  const signOut = (cb: VoidFunction) => {
    setUser(null);
    if (cb) cb();
  };

  const register = ({}, cb: VoidFunction) => {
    setUser(fakeUser);
    if (cb) cb();
  };

  const isLogged = () => user !== null;

  const value = { user, isLogged, signIn, signOut, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
