import { Router } from "express";
import { LoginParams } from "common";
import { UserModel } from "../models";
import { promisify } from "util";
import { AuthErrorType } from "../errors";

const routes = Router();

declare module "express-session" {
  export interface SessionData {
    userId: string;
    active: boolean;
  }
}

routes.put("/login", async (req, res, next) => {
  try {
    const { mail: login, password }: LoginParams = req.body;
    const user = await UserModel.findUserLogin(login, password);

    req.session.userId = user.id;

    return res.status(200).json(user);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.name) {
        case AuthErrorType.UNKNOWN_USER:
          return res.status(404).send({ error: e.message });
        case AuthErrorType.EMPTY_INFORMATION:
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
      await promisify(req.session.destroy)();
    }
    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

export default routes;
