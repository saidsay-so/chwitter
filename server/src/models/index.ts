import { UserSchema } from "./user";
import { MessageSchema } from "./message";
import { getModelForClass } from "@typegoose/typegoose";
import { MessageResponse, UserResponse } from "common";
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
      transform: (doc, returnValue, opts): MessageResponse => {
        assert(opts.custom);
        return new MessageResponse({
          ...(returnValue as any),
          ...opts.custom,
          date: returnValue.date.getTime(),
          id: doc.id,
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
      transform: (doc, returnValue, opts): UserResponse => {
        assert(opts.custom);
        return new UserResponse({
          ...(returnValue as any),
          ...opts.custom,
          id: doc.id,
        });
      },
    },
  },
});
