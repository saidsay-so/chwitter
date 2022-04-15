import axios from "axios";
import {
  MessageResponse,
  MessagesResponse,
  MessagesSearchParams,
} from "common";
import { User } from "./user";

export interface Message extends MessageResponse {
  author: User;
}

export const createMessage = async (content: string, uid?: User["id"]) => {
  const res = await axios.post("/api/messages", { content });

  console.info(res.data);
};

export const deleteMessage = async (mid: Message["id"]) => {
  await axios.delete(`/api/messages/${mid}`);
};

export const likeMessage = async (mid: Message["id"], uid?: User["id"]) => {
  await axios.put(`/api/messages/${mid}/${uid ?? ""}/like`);
};

export const unlikeMessage = async (mid: Message["id"], uid?: User["id"]) => {
  await axios.delete(`/api/messages/${mid}/${uid ?? ""}/like`);
};

export const getMessages = async (
  params?: MessagesSearchParams
): Promise<Message[]> => {
  const res = await axios.get<MessagesResponse>("/api/messages", {
    params,
  });

  const { messages: rawMessages } = res.data;
  console.log(rawMessages);

  const messages = rawMessages.map(
    ({ author: { id, ...author }, ...user }) => ({
      ...user,
      author: { ...author, id, profileLink: `/users/${id}` },
    })
  );

  return messages;
};
