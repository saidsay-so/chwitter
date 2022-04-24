import axios from "axios";
import { UpdateUserParams, UserResponse } from "common";

export class User extends UserResponse {
  profileLink!: string;

  constructor(params: UserResponse) {
    super({ ...params });
    this.profileLink = `/users/${params.id}`;
  }
}

export const getUser = async (uid: string) => {
  const res = await axios.get<UserResponse>(`/api/users/${uid}`);
  const user = new User(res.data);

  return user;
};

export const editUser = async (params: UpdateUserParams, uid?: string) => {
  const res = await axios.patch<UserResponse>(`/api/users/${uid ?? ""}`, {
     ...params,
  });
  const user = new User(res.data);

  return user;
};
