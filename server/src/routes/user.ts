import { RegisterParams, UpdateUserParams } from "common";
import { Router, Response } from "express";
import sharp from "sharp";
import { AuthError, AuthErrorType } from "../errors";
import { UserModel } from "../models";
import {
  checkRights,
  getAvatarLink,
  getFriendState,
  requireAuth,
} from "../utils";
import { createAvatar } from "@dicebear/avatars";
import * as avatarStyle from "@dicebear/micah";

const routes = Router();

const SAVED_FORMAT: keyof sharp.FormatEnum & keyof sharp.Sharp = "avif";
const OUTPUT_FORMATS: (keyof sharp.FormatEnum & keyof sharp.Sharp)[] = [
  SAVED_FORMAT,
  "webp",
  "jpeg",
];

const renderAvatar = (buffer: Buffer, res: Response) => {
  const render: Parameters<Response["format"]>["0"] = {};

  for (const format of OUTPUT_FORMATS) {
    render[format] = () => sharp(buffer)[format]().pipe(res.status(200));
  }

  return res.format(render);
};

/**
 * @typedef {object} UserResponse
 * @property {string} id - user id
 * @property {string} name - username
 * @property {string} displayName - display name
 * @property {string} avatarLink - link to avatar
 * @property {boolean} isFriend - if is friend with current user
 * @property {string} description - description
 */

/**
 * @typedef {object} UsersResponse
 * @property {array<UserResponse>} users - users
 */

/**
 * @typedef {object} RegisterParams
 * @property {string} name
 * @property {string} password
 */

/**
 * POST /api/users/
 * @tags User - User related services
 * @summary Create user
 * @param {RegisterParams} request.body.required - user params
 * @return {UserResponse} 201 - Created user
 */
routes.post("/", async (req, res, next) => {
  try {
    const { name, password }: RegisterParams = req.body;
    const avatar = await sharp(
      Buffer.from(
        createAvatar(avatarStyle, {
          seed: name,
        })
      )
    )
      .resize(96, 96)
      .avif({ lossless: true })
      .toBuffer();
    const newUser = await UserModel.create({ name, password, avatar });

    req.session!.userId! = newUser.id;

    return res.status(201).json(
      newUser.toJSON({
        custom: {
          isFriend: false,
          avatarLink: getAvatarLink(newUser.id!),
        },
      })
    );
  } catch (e) {
    return next(e);
  }
});

/**
 * GET /api/users/{uid}
 * @tags User - User related services
 * @summary Get user
 * @param {string} uid.path - user id
 * @return {UserResponse} 200 - User
 */
routes.get("/:uid", async (req, res, next) => {
  const { uid } = req.params;

  try {
    const rawUser = await UserModel.findById(uid)
      .orFail(new AuthError(AuthErrorType.UNKNOWN_USER))
      .exec();

    const user = rawUser.toJSON({
      custom: {
        isFriend: req.session?.userId
          ? await getFriendState(req.session!.userId!, uid)
          : false,
        avatarLink: getAvatarLink(uid),
      },
    });

    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
});

/**
 * @typedef {object} UpdateUserParams
 * @property {string} password
 * @property {string} displayName
 * @property {string} description
 */

/**
 * PATCH /api/users/{uid}
 * @tags User - User related services
 * @summary Modify user
 * @param {string} uid.path - user id
 * @param {UpdateUserParams} request.body.required - user params
 * @return {UserResponse} 203 - User
 */
routes.patch("/:uid?", requireAuth, checkRights, async (req, res, next) => {
  let { uid } = req.params;
  if (!uid) {
    uid = req.session!.userId!;
  }

  try {
    const { password, displayName, description }: UpdateUserParams = req.body;

    const user = await UserModel.findByIdAndUpdate(
      uid,
      {
        password,
        displayName,
        description,
      },
      { new: true, runValidators: true }
    )
      .orFail(new AuthError(AuthErrorType.UNKNOWN_USER))
      .exec();

    return res.status(203).json(
      user.toJSON({
        custom: { isFriend: false, avatarLink: `${req.path}/avatar` },
      })
    );
  } catch (e) {
    return next(e);
  }
});

/**
 * GET /api/users/{uid}/avatar
 * @tags User - User related services
 * @summary Get user avatar
 * @param {string} uid.path - user id
 * @return {string} 200 - Avatar - binary
 */
routes.get("/:uid/avatar", async (req, res, next) => {
  const { uid } = req.params;

  try {
    const user = await UserModel.findById(uid).select("avatar").lean().exec();
    if (!user || !user.avatar) return res.sendStatus(404);
    //@ts-expect-error
    return renderAvatar(user.avatar.buffer, res);
  } catch (e) {
    return next(e);
  }
});

// TODO: add delete route

export default routes;
