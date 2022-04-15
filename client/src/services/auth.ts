import axios from "axios";
import { LoginParams, RegisterParams, UserResponse } from "common";

export const login = async (loginInfo: LoginParams) => {
  const res = await axios.put<UserResponse>("/api/auth/login", {
    ...loginInfo,
  });

  return res.data;
};

export const logout = async () => {
  const res = await axios.delete("/api/auth/logout");

  return res.data;
};

export const register = async (registerInfo: RegisterParams) => {
  const res = await axios.post<UserResponse>("/api/users", { ...registerInfo });

  return res.data;
};
