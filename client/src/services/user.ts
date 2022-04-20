import axios from "axios";
import { UserResponse } from "common";

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
