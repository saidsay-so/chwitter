import {
  MessageResponse,
  MessagesParams,
  MessagesResponse,
  UserResponse,
} from "common";
import { Router } from "express";
import mongoose from "mongoose";
import { MessageModel, UserModel } from "../models";
import { MessageSchema } from "../models/message";
import { requireAuth } from "../utils";

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
    }: MessagesParams = req.query;

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
      .skip(skip)
      .limit(limit)
      .populate("author", "_id name displayName description")
      .lean()
      .exec();

    const messages = await Promise.all(
      rawMessages.map(
        async ({ author, date, ...msg }) =>
          new MessageResponse({
            ...msg,
            author: new UserResponse({
              ...author,
              isFriend:
                (await UserModel.exists({
                  _id: req.session.userId,
                  friends: uid,
                })) !== null,
              //TODO: Dangerous?
              avatarLink: `${req.path}/avatar`,
            } as ConstructorParameters<typeof UserResponse>[0]),
            date: date.getTime(),
            isLiked:
              (await UserModel.exists({
                _id: req.session.userId,
                likedMessages: msg._id,
              })) !== null,
          })
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
    await MessageModel.create({ author, content });

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

routes.put("/:mid/like", async (req, res, next) => {
  const { mid } = req.params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await MessageModel.findByIdAndUpdate(
        mid,
        { $inc: { likes: 1 } },
        { session }
      ).exec();
      await UserModel.findByIdAndUpdate(req.session.userId, {
        $push: { likedMessages: mid },
      }).exec();
    });

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  } finally {
    session.endSession();
  }
});

routes.delete("/:mid/like", async (req, res, next) => {
  const { mid } = req.params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await MessageModel.findByIdAndUpdate(
        mid,
        { $inc: { likes: -1 } },
        { session }
      ).exec();
      await UserModel.findByIdAndUpdate(req.session.userId, {
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

routes.get("/:mid", async (req, res) => {
  return res.sendStatus(501);
});

routes.patch("/:mid", async (req, res, next) => {
  const { mid } = req.params;
  try {
    const { content } = req.body;
    if (content) {
      await MessageModel.findByIdAndUpdate(mid, { $set: { content } }).exec();
    }
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

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
