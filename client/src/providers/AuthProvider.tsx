import { createContext, ReactNode, useContext, useState } from "react";
import { fakeUser, User } from "../services/user";

interface LoginParams {
  login: string;
  password: string;
}

interface RegisterParams {
  mail: string;
  name: string;
  displayName: string;
  description: string;
  avatar: Blob;
  password: string;
}

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
