import { DocumentType } from "@typegoose/typegoose";
import {
  MessagesSearchParams,
  MessagesResponse,
  MessageResponse,
  CreateMessageParams,
} from "common";
import { RequestHandler, Router } from "express";
import mongoose, { ClientSession } from "mongoose";
import { AuthError, AuthErrorType, ChwitterError } from "../errors";
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

// const PAGE_LIMIT = 50;

class LikeError extends ChwitterError {
  constructor() {
    super("Message is already (un)liked!");
  }
}

const messageIsLiked = async (
  mid: string,
  uid: string,
  session?: ClientSession
) => {
  const doc = session
    ? await UserModel.findOne({ _id: uid, likedMessages: mid }, null, {
        session,
      }).exec()
    : await UserModel.exists({ _id: uid, likedMessages: mid });

  return doc !== null;
};

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

/**
 * @typedef {object} MessageResponse
 * @property {string} id - message id
 * @property {UserResponse} author
 * @property {string} content
 * @property {number} date
 * @property {number} likes
 * @property {boolean} isLiked - if is liked by the current user
 */

/**
 * @typedef {object} MessagesResponse
 * @property {array<MessageResponse>} messages
 */

/**
 * @typedef {object} MessagesSearchParams
 * @property {string} uid - get messages only from this user
 * @property {string} search - filter according to the keywords
 * @property {string} liked - get only liked messages
 * @property {string} onlyfollowed - get messages only from users followed by the current one
 */

/**
 * GET /api/messages/
 * @tags Messages - Message related services
 * @summary Get messages
 * @param {string} uid.query - user id
 * @param {string} search.query - search filter with keywords
 * @param {string} onlyfollowed.query - filter with messages only from friends
 * @param {string} liked.query - filter with only liked messages
 * @returns {MessagesResponse} 200 - Messages
 */
routes.get("/", async (req, res, next) => {
  try {
    const {
      uid = "",
      search = "",
      liked = "false",
      onlyfollowed = "false",
    }: // page = "0",
    MessagesSearchParams = req.query;

    // const pageNumber: number = Number.isNaN(parseInt(page, 10))
    //   ? 0
    //   : parseInt(page, 10);

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
    }

    const rawMessages = await MessageModel.find(params)
      .sort({ date: -1 })
      // .skip(pageNumber * PAGE_LIMIT)
      // .limit(PAGE_LIMIT)
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

/**
 * @typedef {object} CreateMessageParams
 * @property {string} content
 */

/**
 * POST /api/messages/
 * @tags Messages - Message related services
 * @summary Add new message
 * @param {CreateMessageParams} request.body.required - message content
 * @return {MessageResponse} 201 - Message
 */
routes.post("/", async (req, res, next) => {
  const { userId: author } = req.session!;
  try {
    const { content }: CreateMessageParams = req.body;

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

/**
 * PUT /api/messages/{mid}/like
 * @tags Messages - Message related services
 * @summary Like message
 * @param {string} mid.path.required - message id
 * @return {string} 200 - Status
 * @return {string} 403 - Status when message is already liked
 */
routes.put(
  "/:mid/like",
  checkRights,
  checkMessageExists,
  async (req, res, next) => {
    const { mid } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (await messageIsLiked(mid!, req.session!.userId!, session)) {
          throw new LikeError();
        }

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
      if (e instanceof LikeError) {
        return res.sendStatus(403);
      }

      return next(e);
    } finally {
      session.endSession();
    }
  }
);

/**
 * DELETE /api/messages/{mid}/like
 * @tags Messages - Message related services
 * @summary Unlike message
 * @param {string} mid.path.required - message id
 * @return {string} 200 - Status
 * @return {string} 403 - Status when message is not liked
 */
routes.delete(
  "/:mid/like",
  checkRights,
  checkMessageExists,
  async (req, res, next) => {
    const { mid } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (!(await messageIsLiked(mid!, req.session!.userId!, session))) {
          throw new LikeError();
        }

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
      if (e instanceof LikeError) {
        return res.sendStatus(403);
      }

      return next(e);
    } finally {
      session.endSession();
    }
  }
);

/**
 * GET /api/messages/{mid}
 * @tags Messages - Message related services
 * @summary Get message
 * @param {string} mid.path.required - message id
 * @returns {MessageResponse} 200 - Message
 */
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

/**
 * DELETE /api/messages/{mid}
 * @tags Messages - Message related services
 * @summary Delete message
 * @param {string} mid.path.required - message id
 * @returns {string} 200 - Status
 */
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
