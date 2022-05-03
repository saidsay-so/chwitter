import axios from "axios";
import { UpdateUserParams, UserResponse } from "common";
import { Service } from "./base";

export class User extends UserResponse {
  profileLink!: string;

  constructor(params: UserResponse) {
    super({ ...params });
    this.profileLink = `/users/${params.id}`;
  }
}

export const getUser: Service<User["id"], User> = async (uid, signal) => {
  const res = await axios.get<UserResponse>(`/api/users/${uid}`, { signal });
  const user = new User(res.data);

  return user;
};

export const editUser: Service<UpdateUserParams, User> = async (
  params,
  signal
) => {
  const res = await axios.patch<UserResponse>(
    `/api/users`,
    {
      ...params,
    },
    { signal }
  );
  const user = new User(res.data);

  return user;
};
