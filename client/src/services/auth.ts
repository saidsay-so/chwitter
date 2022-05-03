import axios from "axios";
import { LoginParams, RegisterParams, UserResponse } from "common";
import { Service } from "./base";

export const login: Service<LoginParams | null, UserResponse> = async (
  loginInfo,
  signal
) => {
  const res = await axios.put<UserResponse>(
    "/api/auth/login",
    {
      ...loginInfo,
    },
    { signal }
  );

  return res.data;
};

export const logout: Service<undefined, UserResponse> = async (_, signal) => {
  const res = await axios.delete("/api/auth/logout", { signal });

  return res.data;
};

export const register: Service<RegisterParams, UserResponse> = async (
  registerInfo,
  signal
) => {
  const res = await axios.post<UserResponse>(
    "/api/users",
    { ...registerInfo },
    { signal }
  );

  return res.data;
};
