import { User } from "./user";

export interface Message {
  id: string;
  author: User;
  content: string;
  date: number;
  likes: number;
  isFriend?: boolean;
  isLiked?: boolean;
}
