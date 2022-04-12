import { MessageResponse } from "./message";

export class MessagesResponse {
  messages!: MessageResponse[];

  constructor({ messages }: { messages: MessageResponse[] }) {
    this.messages = messages;
  }
}

export class MessagesParams {
  uid?: string;
  search?: string;
  onlyfollowed?: "false" | "true" | string;
  limit?: number;
  skip?: number;
}
