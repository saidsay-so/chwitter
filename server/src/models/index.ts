import { UserSchema } from "./user";
import { MessageSchema } from "./message";
import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { MessageResponse, UserResponse } from "common";
import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import mongoose from "mongoose";
export interface MessageTransformOptions {
  isLiked?: boolean;
}

declare module "mongoose" {
  export interface ToObjectOptions {
    message?: MessageTransformOptions;
    user?: UserTransformOptions;
    classTransformer?: ClassTransformOptions;
  }
}

export const MessageModel = getModelForClass(MessageSchema, {
  schemaOptions: {
    timestamps: { createdAt: "date" },
    toJSON: {
      transform: (
        doc: DocumentType<MessageSchema>,
        _returnValue,
        opts: mongoose.ToObjectOptions
      ) => {
        const obj = instanceToPlain(
          plainToInstance(MessageSchema, doc, opts.classTransformer),
          opts.classTransformer
        );

        return new MessageResponse({ ...(obj as any), ...opts.message });
      },
    },
  },
});

export interface UserTransformOptions {
  isFriend?: boolean;
  avatarLink?: string;
}

export const UserModel = getModelForClass(UserSchema, {
  schemaOptions: {
    toJSON: {
      transform: (
        doc: DocumentType<UserSchema>,
        _returnValue,
        opts: mongoose.ToObjectOptions
      ) => {
        const obj = instanceToPlain(
          plainToInstance(UserSchema, doc, opts.classTransformer),
          opts.classTransformer
        );

        return new UserResponse({ ...(obj as any), ...opts.user });
      },
    },
  },
});
