import { UserResponse } from "./user";
export class MessageResponse {
  id!: string;
  author!: UserResponse;
  content!: string;
  date!: number;
  likes!: number;
  isLiked!: boolean;

  constructor({
    id,
    author,
    content,
    date,
    likes,
    isLiked,
  }: {
    id: string;
    author: UserResponse;
    content: string;
    date: number;
    likes: number;
    isLiked: boolean;
  }) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.date = date;
    this.likes = likes;
    this.isLiked = isLiked;
  }
}

export class UpdateMessageParams {
  content!: string;
}

export class CreateMessageParams {
  content!: string;
}

export class MessagesResponse {
  messages!: MessageResponse[];

  constructor({ messages }: { messages: MessageResponse[] }) {
    this.messages = messages;
  }
}

export class MessagesSearchParams {
  uid?: string;
  username?: string;
  search?: string;
	liked?: string;
  onlyfollowed?: "false" | "true" | string;
  page?: string;
}
