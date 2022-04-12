import { GetFriendResponse, UserResponse, UsersResponse } from "common";
import { Router } from "express";
import { UserModel } from "../models";
import { checkRights, requireAuth } from "../utils";

const routes = Router();

routes.all("*", requireAuth);

routes.get("/:uid?/all", async (req, res, next) => {
  let { uid } = req.params;
  try {
    if (!uid) {
      uid = req.session.userId;
    }

    const user = await UserModel.findById(uid)
      .select("friends")
      .populate("friends", "_id name displayName description")
      .lean()
      .exec();

    if (user) {
      const users =
        user.friends && user.friends[0]
          ? await Promise.all(
              user.friends.map(
                async (friend) =>
                  new UserResponse({
                    ...friend,
                    isFriend:
                      (await UserModel.exists({
                        _id: req.session.userId,
                        friends: (friend as typeof friend & { _id: any })._id,
                      })) !== null,
                    //TODO: Dangerous?
                    avatarLink: `${req.path}/avatar`,
                  } as ConstructorParameters<typeof UserResponse>[0])
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
    uid = req.session.userId;
  }

  try {
    const isFriend =
      (await UserModel.find({ _id: uid, friends: friendUid }).exec()) !== null;
    return res.status(200).json(new GetFriendResponse({ isFriend }));
  } catch (e) {
    return next(e);
  }
});

routes.put("/:uid?/:friendUid", checkRights, async (req, res, next) => {
  let { uid, friendUid } = req.params;
  if (!uid) {
    uid = req.session.userId;
  }

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
    uid = req.session.userId;
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
