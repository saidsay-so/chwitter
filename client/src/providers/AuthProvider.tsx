import { LoginParams, RegisterParams } from "common";
import { createContext, ReactNode, useContext, useState } from "react";
import { login, logout, register as registerService } from "../services/auth";
import { User } from "../services/user";

type MaybeErrorCallback = (err?: any) => void;

interface Context {
  user: User | null;
  isLogged: () => boolean;
  signIn: (l: LoginParams | null, cb: MaybeErrorCallback) => void;
  signOut: (cb: MaybeErrorCallback) => void;
  register: (r: RegisterParams, cb: MaybeErrorCallback) => void;
}

const AuthContext = createContext<Context>({} as Context);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (loginInfo: LoginParams | null, cb: MaybeErrorCallback) =>
    login(loginInfo)
      .then((user) => setUser(new User(user)))
      .then(cb)
      .catch(cb);

  const signOut = (cb: MaybeErrorCallback) =>
    logout()
      .then(() => setUser(null))
      .then(cb)
      .catch(cb);

  const register = (registerInfo: RegisterParams, cb: MaybeErrorCallback) =>
    registerService(registerInfo)
      .then((user) => setUser(new User(user)))
      .then(cb)
      .catch(cb);

  const isLogged = () => user !== null;

  const value = { user, isLogged, signIn, signOut, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
