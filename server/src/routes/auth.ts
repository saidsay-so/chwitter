import { Router } from "express";
import { LoginParams } from "common";
import { UserModel } from "../models";
import { AuthError, AuthErrorType } from "../errors";
import { getAvatarLink } from "../utils";

const routes = Router();

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

routes.put("/login", async (req, res, next) => {
  try {
    const { name, password }: LoginParams = req.body;
    const user = req.session.userId ? await UserModel.findById(req.session.userId).exec() : await UserModel.findUserLogin(name, password);

    if (!user) {
      throw new AuthError(AuthErrorType.UNKNOWN_USER);
    };

    if (!req.session.userId) {
      req.session.userId = user.id;
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

routes.delete("/logout", async (req, res, next) => {
  try {
    if (req.session.userId) {
      //@ts-expect-error
      req.session = null;
    }
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

export default routes;
