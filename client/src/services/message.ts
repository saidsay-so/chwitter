import axios from "axios";
import {
  CreateMessageParams,
  MessageResponse,
  MessagesResponse,
  MessagesSearchParams,
} from "common";
import { Service } from "./base";
import { User } from "./user";

export interface Message extends MessageResponse {
  author: User;
}

export const createMessage: Service<CreateMessageParams, Message> = async (
  message,
  signal
) => {
  const res = await axios.post<MessageResponse>("/api/messages", message, {
    signal,
  });

  const { author, ...msg } = res.data;

  return { ...msg, author: new User(author) };
};

export const deleteMessage: Service<Message["id"], void> = async (
  mid: Message["id"],
  signal
) => {
  await axios.delete(`/api/messages/${mid}`, { signal });
};

export const likeMessage: Service<Message["id"], void> = async (
  mid: Message["id"],
  signal
) => {
  await axios.put(`/api/messages/${mid}/like`, { signal });
};

export const unlikeMessage: Service<Message["id"], void> = async (
  mid,
  signal
) => {
  await axios.delete(`/api/messages/${mid}/like`, { signal });
};

export const getMessages: Service<
  MessagesSearchParams | undefined,
  Message[]
> = async (params, signal): Promise<Message[]> => {
  const res = await axios.get<MessagesResponse>("/api/messages", {
    params,
    signal,
  });
  const { messages: rawMessages } = res.data;

  const messages = rawMessages.map(({ author, ...user }) => ({
    ...user,
    author: new User(author),
  }));

  return messages;
};
