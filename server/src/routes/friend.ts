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

// TODO: Import directly from "common" package
//

/**
 * @typedef {object} GetFriendStateResponse
 * @property {boolean} isFriend
 */

/**
 * GET /api/friends/{uid}/all
 * @tags Friends - Friend related services
 * @summary Get all friends for a user
 * @param {string} uid.path - user id
 * @return {UsersResponse} 200 - Friends
 */
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

/**
 * GET /api/friends/{uid}/{friendUid}
 * @tags Friends - Friend related services
 * @summary Get if the user `uid` has added `friendUid` as friend
 * @param {string} uid.path - user id
 * @param {string} friendUid.path.required - user id
 * @return {GetFriendStateResponse} 200 - Friend state
 */
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

/**
 * PUT /api/friends/{uid}/{friendUid}
 * @tags Friends - Friend related services
 * @summary Add `friendUid` as friend of user `uid`
 * @param {string} uid.path - user id
 * @param {string} friendUid.path.required - friend id
 * @return {string} 201 - Status
 */
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

/**
 * DELETE /api/friends/{uid}/{friendUid}
 * @tags Friends - Friend related services
 * @summary Delete `friendUid` from friends of user `uid`
 * @param {string} uid.path - user id
 * @param {string} friendUid.path.required - friend id
 * @return {string} 200 - success
 */
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
