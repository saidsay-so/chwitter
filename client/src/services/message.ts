import axios from "axios";
import {
  CreateMessageParams,
  MessageResponse,
  MessagesResponse,
  MessagesSearchParams,
} from "common";
import { User } from "./user";

export interface Message extends MessageResponse {
  author: User;
}

export const createMessage = async (message: CreateMessageParams) => {
  const res = await axios.post<MessageResponse>("/api/messages", message);

  const { author, ...msg } = res.data;

  return { ...msg, author: new User(author) };
};

export const deleteMessage = async (mid: Message["id"]) => {
  await axios.delete(`/api/messages/${mid}`);
};

export const likeMessage = async (mid: Message["id"]) => {
  await axios.put(`/api/messages/${mid}/like`);
};

export const unlikeMessage = async (mid: Message["id"]) => {
  await axios.delete(`/api/messages/${mid}/like`);
};

export const getMessages = async (
  params?: MessagesSearchParams
): Promise<Message[]> => {
  const res = await axios.get<MessagesResponse>("/api/messages", {
    params,
  });
  const { messages: rawMessages } = res.data;

  const messages = rawMessages.map(({ author, ...user }) => ({
    ...user,
    author: new User(author),
  }));

  return messages;
};
