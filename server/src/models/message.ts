import { index, prop, Ref } from "@typegoose/typegoose";
import { UserSchema } from "./user";

@index({ content: "text" }, { default_language: "fr" })
@index({ date: "date" })
export class MessageSchema {
  @prop({ required: true, ref: () => UserSchema })
  author!: Ref<UserSchema>;

  @prop({ required: true })
  content!: string;

  @prop({ required: true, default: Date.now })
  date!: Date;

  @prop({ default: 0 })
  likes!: number;
}
