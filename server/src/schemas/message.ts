import { prop } from "@typegoose/typegoose";
import { UserSchema } from "./user";

export class MessageSchema {
  @prop({ required: true })
  author!: UserSchema;

  @prop({ required: true })
  content!: string;

  @prop({ required: true, default: Date.now })
  date!: Date;

  @prop({ default: 0 })
  likes!: number;
}
