import { DocumentType } from "@typegoose/typegoose";
import { GetFriendStateResponse, UserResponse, UsersResponse } from "common";
import { Router } from "express";
import { UserModel } from "../models";
import { UserSchema } from "../models/user";
import {
  checkRights,
  getAvatarLink,
  getFriendState,
  requireAuth,
} from "../utils";

const routes = Router();

routes.all("*", requireAuth);

routes.get("/:uid?/all", async (req, res, next) => {
  let { uid } = req.params;
  try {
    if (!uid) {
      uid = req.session!.userId!;
    }

    const user = await UserModel.findById(uid)
      .select("friends")
      .populate("friends")
      .exec();

    if (user) {
      const users = user.friends
        ? await Promise.all(
            user.friends.map(
              async (friend) =>
                (friend as DocumentType<UserSchema>).toJSON({
                  custom: {
                    isFriend: await getFriendState(
                      req.session!.userId!,
                      (friend as typeof friend & { _id: any })._id
                    ),
                    avatarLink: getAvatarLink(
                      (friend as DocumentType<UserSchema>)!.id!
                    ),
                  },
                }) as unknown as UserResponse
            )
          )
        : [];

      return res.status(200).json(new UsersResponse({ users }));
    }

    return res.sendStatus(500);
  } catch (e) {
    return next(e);
  }
});

routes.get("/:uid?/:friendUid", checkRights, async (req, res, next) => {
  let { uid, friendUid } = req.params;
  if (!uid) {
    uid = req.session!.userId!;
  }

  if (uid === friendUid) return res.sendStatus(403);

  try {
    const isFriend = await getFriendState(uid!, friendUid!);
    return res.status(200).json(new GetFriendStateResponse({ isFriend }));
  } catch (e) {
    return next(e);
  }
});

routes.put("/:uid?/:friendUid", checkRights, async (req, res, next) => {
  let { uid, friendUid } = req.params;
  if (!uid) {
    uid = req.session!.userId!;
  }

  if (uid === friendUid) return res.sendStatus(403);

  try {
    await UserModel.findByIdAndUpdate(uid, {
      $push: { friends: friendUid },
    }).exec();
    return res.sendStatus(201);
  } catch (e) {
    return next(e);
  }
});

routes.delete("/:uid?/:friendUid", checkRights, async (req, res, next) => {
  let { uid, friendUid } = req.params;
  if (!uid) {
    uid = req.session!.userId!;
  }

  if (uid === friendUid) {
    return res.sendStatus(403);
  }

  try {
    await UserModel.findByIdAndUpdate(uid, {
      $pull: { friends: friendUid },
    }).exec();

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

export default routes;
