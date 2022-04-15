import axios from "axios";
import { UsersResponse } from "common";
import { User } from "./user";

export const getFriends = async (uid: string) => {
  const res = await axios.get<UsersResponse>(`/api/friends/${uid}/all`);
  const friends = res.data.users.map((user) => new User(user));
  return friends;
};

export const addFriend = async (friendUid: string, mainUid?: string) => {
  await axios.put(`/api/friends/${mainUid ?? ""}/${friendUid}`);
};

export const removeFriend = async (friendUid: string, mainUid?: string) => {
  await axios.delete(`/api/friends/${mainUid ?? ""}/${friendUid}`);
};
