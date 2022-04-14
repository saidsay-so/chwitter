import { UserSchema } from "./user";
import { MessageSchema } from "./message";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { MessageResponse, UserResponse } from "common";
import mongoose from "mongoose";
import assert from "assert";
export interface MessageTransformOptions extends UserTransformOptions {
  isLiked: boolean;
}

type TransformOptions = MessageTransformOptions | UserTransformOptions;

declare module "mongoose" {
  export interface ToObjectOptions {
    custom?: TransformOptions;
  }
}

export const MessageModel = getModelForClass(MessageSchema, {
  schemaOptions: {
    timestamps: { createdAt: "date" },
    toJSON: {
      transform: (
        _doc: DocumentType<MessageSchema>,
        returnValue: mongoose.LeanDocument<MessageSchema> & {
          author: UserResponse;
        } & { _id: string },
        opts: mongoose.ToObjectOptions & { custom: MessageTransformOptions }
      ): MessageResponse => {
        assert(opts.custom);
        return new MessageResponse({
          ...returnValue,
          date: returnValue.date.getTime(),
          ...opts.custom,
        });
      },
    },
  },
});

export interface UserTransformOptions {
  isFriend: boolean;
  avatarLink: string;
}

export const UserModel = getModelForClass(UserSchema, {
  schemaOptions: {
    toJSON: {
      transform: (
        _doc: DocumentType<UserSchema>,
        returnValue: mongoose.LeanDocument<UserSchema> & { _id: string },
        opts: mongoose.ToObjectOptions & { custom: UserTransformOptions }
      ): UserResponse => {
        assert(opts.custom);
        return new UserResponse({ ...returnValue, ...opts.custom });
      },
    },
  },
});
