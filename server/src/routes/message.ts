import {
  MessageResponse,
  MessagesSearchParams,
  MessagesResponse,
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
      .skip(skip)
      .limit(limit)
      .populate("author")
      .exec();

    const messages = await Promise.all(
      rawMessages.map(
        async (msg) =>
          msg.toJSON({
            user: {
              isFriend:
                (await UserModel.exists({
                  _id: req.session.userId,
                  friends: uid,
                })) !== null,
              //TODO: Dangerous?
              avatarLink: `${req.path}/avatar`,
            },
            message: {
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

//TODO: should we add this route?
routes.get("/:mid", async (_req, res) => {
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
