import { UserResponse } from "./user";

export class MessageResponse {
  id!: string;
  author!: UserResponse;
  content!: string;
  date!: number;
  likes!: number;
  isLiked?: boolean;

  constructor({
    _id,
    author,
    content,
    date,
    likes,
    isLiked,
  }: {
    _id: string;
    author: UserResponse;
    content: string;
    date: number;
    likes: number;
    isLiked: boolean;
  }) {
    this.id = _id;
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
