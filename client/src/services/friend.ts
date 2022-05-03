import axios from "axios";
import { UsersResponse } from "common";
import { Service } from "./base";
import { User } from "./user";

export const getFriends: Service<User["id"], User[]> = async (uid, signal) => {
  const res = await axios.get<UsersResponse>(`/api/friends/${uid}/all`, {
    signal,
  });
  const friends = res.data.users.map((user) => new User(user));
  return friends;
};

export const addFriend: Service<User["id"], void> = async (
  friendUid,
  signal
) => {
  await axios.put(`/api/friends/${friendUid}`, { signal });
};

export const removeFriend: Service<User["id"], void> = async (
  friendUid,
  signal
) => {
  await axios.delete(`/api/friends/${friendUid}`, { signal });
};
