import { index, prop, Ref } from "@typegoose/typegoose";
import { Expose } from "class-transformer";
import { BaseDocument } from "./base";
import { UserSchema } from "./user";

@Expose()
@index({ content: "text" }, { default_language: "fr" })
export class MessageSchema extends BaseDocument {
  @prop({ required: true, ref: () => UserSchema })
  author!: Ref<UserSchema>;

  // We add it to the model using schema options
  date!: Date;

  @prop({ required: true })
  content!: string;

  @prop({ default: 0 })
  likes!: number;
}
