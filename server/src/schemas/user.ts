import { prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { MessageSchema } from "./message";

export class UserSchema {
  id!: mongoose.Types.ObjectId;
  @prop({ required: true })
  name!: string;
  @prop({ required: true })
  displayName!: string;

  get profileLink() {
    return `/users/${this.id.toString()}`;
  }

  @prop({ required: true, type: () => Buffer })
  avatar?: Buffer;
  @prop({ required: true })
  description!: string;
  @prop({ ref: () => MessageSchema })
  messages?: Ref<MessageSchema>[];
  @prop({ ref: () => MessageSchema })
  likedMessages?: Ref<MessageSchema>[];
  @prop({ ref: () => UserSchema })
  friends?: Ref<UserSchema>[];
}
