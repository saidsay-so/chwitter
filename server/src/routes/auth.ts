import { Router } from "express";
import { LoginParams } from "common";
import { UserModel } from "../models";
import { AuthError, AuthErrorType } from "../errors";
import { getAvatarLink } from "../utils";

const routes = Router();

/**
 * Login parameters
 * @typedef {object} LoginParams
 * @property {string} name - Username
 * @property {string} password - Password
 */

/**
 * PUT /api/auth/login
 * @tags Auth - Authenticate user
 * @summary Login a user
 * @param {LoginParams} request.body.required - login parameters
 * @returns {UserResponse} 200 - User
 * @returns {object} 409 - empty information
 * @returns {object} 403 - invalid information
 */
routes.put("/login", async (req, res, next) => {
  try {
    const { name, password }: LoginParams = req.body;
    const user = req.session!.userId!
      ? await UserModel.findById(req.session!.userId!).exec()
      : await UserModel.findUserLogin(name, password);

    if (!user) {
      throw new AuthError(AuthErrorType.UNKNOWN_USER);
    }

    if (!req.session!.userId!) {
      req.session!.userId = user.id;
    }

    return res.status(200).json(
      user.toJSON({
        custom: { isFriend: false, avatarLink: getAvatarLink(user.id) },
      })
    );
  } catch (e) {
    if (e instanceof Error) {
      switch (e.name) {
        case AuthErrorType.EMPTY_INFORMATION:
          return res.sendStatus(409);
        case AuthErrorType.UNKNOWN_USER:
        case AuthErrorType.INVALID_PASSWORD:
          return res.status(403).send({ error: e.message });
        default:
      }
    }

    return next(e);
  }
});

/**
 * DELETE /api/auth/logout
 * @tags Auth - Authenticate user
 * @summary Logout a user
 * @returns {string} 200 - Status
 */
routes.delete("/logout", async (req, res, next) => {
  try {
    if (req.session!.userId!) {
      req.session = null;
    }
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

export default routes;
