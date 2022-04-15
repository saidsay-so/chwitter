import { DocumentType } from "@typegoose/typegoose";
import {
  MessagesSearchParams,
  MessagesResponse,
  MessageResponse,
} from "common";
import { Router } from "express";
import mongoose from "mongoose";
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

routes.all("*", requireAuth);

routes.get("/", async (req, res, next) => {
  try {
    const {
      uid = "",
      search = "",
      onlyfollowed = "false",
      skip = 0,
      limit: unclampedLimit = 10,
    }: MessagesSearchParams = req.query;

    const limit = Math.max(0, Math.min(50, unclampedLimit));

    const params: mongoose.FilterQuery<MessageSchema> = {};

    if (search) {
      params["$text"] = { $search: search, $language: "fr" };
    }

    if (onlyfollowed !== "false") {
      const user = await UserModel.findById(req.session.userId)
        .select("friends")
        .exec();

      if (user && user.friends) {
        params["author"] = { $in: user.friends };
      }
    } else if (uid) {
      params["author"] = uid;
    }

    const rawMessages = await MessageModel.find(params)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author")
      .exec();

    const messages = await Promise.all(
      rawMessages.map(
        async (msg) =>
          msg.toJSON({
            custom: {
              isFriend: await getFriendState(
                req.session.userId!,
                (msg!.author! as UserSchema & { _id: any })._id!
              ),
              avatarLink: getAvatarLink(
                (msg!.author! as DocumentType<UserSchema>).id!
              ),
              isLiked:
                (await UserModel.exists({
                  _id: req.session.userId,
                  likedMessages: msg._id,
                })) !== null,
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
  const { userId: author } = req.session;
  try {
    const { content } = req.body;
    console.info(content);

    //TODO: Check if user exists
    await UserModel.exists({ _id: author });

    const msg = await (
      await MessageModel.create({ author, content })
    ).populate("author");

    return res.status(201).json(
      msg.toJSON({
        custom: {
          isFriend: false,
          //TODO: Dangerous?
          avatarLink: getAvatarLink(author!),
          isLiked: false,
        },
      })
    );
  } catch (e) {
    return next(e);
  }
});

//TODO: Add check that user hasn't liked the message
routes.put("/:mid/:uid?/like", checkRights, async (req, res, next) => {
  const { mid, uid } = req.params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await MessageModel.findByIdAndUpdate(
        mid,
        { $inc: { likes: 1 } },
        { session }
      ).exec();
      await UserModel.findByIdAndUpdate(
        uid ?? req.session.userId,
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
});

//TODO: Add check that user has liked the message
routes.delete("/:mid/:uid?/like", checkRights, async (req, res, next) => {
  const { mid, uid } = req.params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await MessageModel.findByIdAndUpdate(
        mid,
        { $inc: { likes: -1 } },
        { session }
      ).exec();
      await UserModel.findByIdAndUpdate(uid ?? req.session.userId, {
        $pull: { likedMessages: mid },
      }).exec();
    });

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  } finally {
    session.endSession();
  }
});

//TODO: should we add this route?
routes.get("/:mid", async (_req, res) => {
  return res.sendStatus(501);
});

routes.patch("/:mid", async (req, res, next) => {
  const { mid } = req.params;
  try {
    const { content } = req.body;
    //TODO: Outer check for author
    const msg = await MessageModel.findOneAndUpdate(
      { _id: mid, author: req.session.userId },
      {
        $set: { content },
      }
    )
      .populate("author")
      .exec();
    return res.status(200).json(msg);
  } catch (e) {
    return next(e);
  }
});

//TODO: Check if it's the owner
routes.delete("/:mid", async (req, res, next) => {
  const { mid } = req.params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await UserModel.updateMany(
        { likedMessages: mid },
        { likedMessages: { $pull: mid } },
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
});

export default routes;
