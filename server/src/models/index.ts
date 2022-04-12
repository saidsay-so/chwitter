import { UserSchema } from "./user";
import { MessageSchema } from "./message";
import { getModelForClass } from "@typegoose/typegoose";

export const MessageModel = getModelForClass(MessageSchema);
export const UserModel = getModelForClass(UserSchema);
