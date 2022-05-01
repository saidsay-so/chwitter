import { DocumentType } from "@typegoose/typegoose";
import {
  MessagesSearchParams,
  MessagesResponse,
  MessageResponse,
} from "common";
import { RequestHandler, Router } from "express";
import mongoose from "mongoose";
import { AuthError, AuthErrorType } from "../errors";
import { MessageModel, UserModel } from "../models";
import { MessageSchema } from "../models/message";
import { UserSchema } from "../models/user";
import {
  checkRights,
  getAvatarLink,
  getFriendState,
  requireAuth,
} from "../utils";

const routes = Router();

const PAGE_LIMIT = 50;

const messageIsLiked = async (mid: string, uid: string) =>
  (await UserModel.exists({ _id: uid, likedMessages: mid })) !== null;

const isMessageAuthor: RequestHandler = async (req, res, next) => {
  const { mid } = req.params;
  try {
    if (
      (await MessageModel.exists({
        _id: mid,
        author: req.session!.userId!,
      })) === null
    ) {
      return res.sendStatus(409);
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

const checkMessageExists: RequestHandler = async (req, res, next) => {
  const { mid } = req.params;
  try {
    if ((await MessageModel.exists({ _id: mid })) === null) {
      return res.sendStatus(409);
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

routes.all("*", requireAuth);

routes.get("/", async (req, res, next) => {
  try {
    const {
      uid = "",
      username = "",
      search = "",
      liked = "false",
      onlyfollowed = "false",
      page = "0",
    }: MessagesSearchParams = req.query;

    const pageNumber: number = Number.isNaN(parseInt(page, 10))
      ? 0
      : parseInt(page, 10);

    const params: mongoose.FilterQuery<MessageSchema> = {};

    if (search) {
      params["$text"] = { $search: search, $language: "fr" };
    }

    if (onlyfollowed !== "false") {
      const user = await UserModel.findById(req.session!.userId!)
        .select("friends")
        .exec();

      if (user && user.friends) {
        params["author"] = { $in: user.friends };
      }
    } else if (uid) {
      if (liked !== "false") {
        const user = await UserModel.findById(uid)
          .select("likedMessages")
          .exec();
        params["_id"] = { $in: user?.likedMessages };
      } else {
        params["author"] = uid;
      }
    } else if (username) {
      params["author"] = (await UserModel.findByName(username).exec())?._id;
    }

    const rawMessages = await MessageModel.find(params)
      .sort({ date: -1 })
      .skip(pageNumber * PAGE_LIMIT)
      .limit(PAGE_LIMIT)
      .populate("author")
      .exec();

    const messages = await Promise.all(
      rawMessages.map(
        async (msg) =>
          msg.toJSON({
            custom: {
              isFriend: await getFriendState(
                req.session!.userId!,
                (msg.author as DocumentType<UserSchema>)._id!
              ),
              avatarLink: getAvatarLink(
                (msg.author as DocumentType<UserSchema>).id!
              ),
              isLiked: await messageIsLiked(msg.id, req.session!.userId!),
            },
          }) as unknown as MessageResponse
      )
    );

    return res.status(200).json(new MessagesResponse({ messages }));
  } catch (e) {
    return next(e);
  }
});

routes.post("/", async (req, res, next) => {
  const { userId: author } = req.session!;
  try {
    const { content } = req.body;

    if (!(await UserModel.exists({ _id: author }))) return res.sendStatus(409);

    const msg = await (
      await MessageModel.create({ author, content })
    ).populate("author");

    return res.status(201).json(
      msg.toJSON({
        custom: {
          isFriend: false,
          avatarLink: getAvatarLink(author!),
          isLiked: false,
        },
      })
    );
  } catch (e) {
    return next(e);
  }
});

routes.put(
  "/:mid/like",
  checkRights,
  checkMessageExists,
  async (req, res, next) => {
    const { mid } = req.params;
    const session = await mongoose.startSession();
    try {
      if (await messageIsLiked(mid!, req.session!.userId!)) {
        return res.sendStatus(409);
      }

      await session.withTransaction(async () => {
        await MessageModel.findByIdAndUpdate(
          mid,
          { $inc: { likes: 1 } },
          { session }
        ).exec();
        await UserModel.findByIdAndUpdate(
          req.session!.userId!,
          {
            $addToSet: { likedMessages: mid },
          },
          { session }
        ).exec();
      });

      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    } finally {
      session.endSession();
    }
  }
);

routes.delete(
  "/:mid/like",
  checkRights,
  checkMessageExists,
  async (req, res, next) => {
    const { mid } = req.params;
    const session = await mongoose.startSession();
    try {
      if (!(await messageIsLiked(mid!, req.session!.userId!))) {
        return res.sendStatus(409);
      }

      await session.withTransaction(async () => {
        await MessageModel.findByIdAndUpdate(
          mid,
          { $inc: { likes: -1 } },
          { session }
        ).exec();
        await UserModel.findByIdAndUpdate(req.session!.userId!, {
          $pull: { likedMessages: mid },
        }).exec();
      });

      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    } finally {
      session.endSession();
    }
  }
);

routes.get("/:mid", checkMessageExists, async (req, res, next) => {
  let { mid } = req.params;

  try {
    const msg = await MessageModel.findById(mid).populate("author").exec();
    //TODO: Change error type
    if (!msg) throw new AuthError(AuthErrorType.EMPTY_INFORMATION);

    return res.status(200).json(
      msg.toJSON({
        custom: {
          isLiked: await messageIsLiked(mid!, req.session!.userId!),
          isFriend: await getFriendState(
            req.session!.userId!,
            (msg.author as DocumentType<UserSchema>)._id!
          ),
          avatarLink: getAvatarLink(
            (msg.author as DocumentType<UserSchema>)._id!
          ),
        },
      })
    );
  } catch (e) {
    return next(e);
  }
});

routes.patch(
  "/:mid",
  checkMessageExists,
  isMessageAuthor,
  async (req, res, next) => {
    const { mid } = req.params;

    try {
      const { content } = req.body;
      const msg = await MessageModel.findByIdAndUpdate(
        { _id: mid },
        { $set: { content } }
      )
        .populate("author")
        .exec();
      return res.status(200).json(
        msg!.toJSON({
          custom: {
            isLiked: await messageIsLiked(mid!, req.session!.userId!),
            isFriend: await getFriendState(
              req.session!.userId!,
              (msg!.author as DocumentType<UserSchema>).id!
            ),
            avatarLink: getAvatarLink(
              (msg!.author as DocumentType<UserSchema>).id!
            ),
          },
        })
      );
    } catch (e) {
      return next(e);
    }
  }
);

routes.delete(
  "/:mid",
  checkMessageExists,
  isMessageAuthor,
  async (req, res, next) => {
    const { mid } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await UserModel.updateMany(
          { likedMessages: mid },
          { $pull: { likedMessages: mid } },
          { session }
        ).exec();
        await MessageModel.findByIdAndDelete(mid, { session }).exec();
      });

      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    } finally {
      session.endSession();
    }
  }
);

export default routes;
