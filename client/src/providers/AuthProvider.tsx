import { LoginParams, RegisterParams } from "common";
import { createContext, ReactNode, useContext, useState } from "react";
import { login, logout, register as registerService } from "../services/auth";
import { User } from "../services/user";

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

  const signIn = async (loginInfo: LoginParams, cb: VoidFunction) => {
    const { id, ...user } = await login(loginInfo);
    setUser({ ...user, id, profileLink: `/users/${id}` });
    if (cb) cb();
  };

  const signOut = async (cb: VoidFunction) => {
    await logout();
    setUser(null);
    if (cb) cb();
  };

  const register = async (registerInfo: RegisterParams, cb: VoidFunction) => {
    const { id, ...user } = await registerService(registerInfo);
    setUser({ ...user, id, profileLink: `/users/${id}` });
    if (cb) cb();
  };

  const isLogged = () => user !== null;

  const value = { user, isLogged, signIn, signOut, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
