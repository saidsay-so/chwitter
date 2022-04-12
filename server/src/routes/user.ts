import { RegisterParams, UpdateUserParams } from "common";
import { Router, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { AuthError, AuthErrorType } from "../errors";
import { UserModel } from "../models";
import { checkRights, requireAuth } from "../utils";

const routes = Router();
const dataHandler = multer();

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

routes.all("*", requireAuth);

routes.post("/", async (req, res, next) => {
  try {
    const { name, mail, password }: RegisterParams = req.body;
    const newUser = await UserModel.create({ name, mail, password });
    return res.status(201).json(
      newUser.toJSON({
        user: {
          avatarLink: `${req.path}/avatar`,
        },
      })
    );
  } catch (e) {
    return next(e);
  }
});

routes.get("/:uid", async (req, res, next) => {
  const { uid } = req.params;

  try {
    const rawUser = await UserModel.findById(uid)
      .orFail(new AuthError(AuthErrorType.UNKNOWN_USER))
      .exec();

    const user = rawUser.toJSON({
      user: {
        isFriend:
          (await UserModel.exists({
            _id: req.session.userId,
            friends: uid,
          })) !== null,
        //TODO: Dangerous?
        avatarLink: `${req.path}/avatar`,
      },
    });

    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
});

routes.patch(
  "/:uid",
  checkRights,
  dataHandler.single("avatar"),
  async (req, res, next) => {
    let { uid } = req.params;
    if (!uid) {
      uid = req.session.userId;
    }

    try {
      const {
        name,
        mail,
        password,
        displayName,
        description,
      }: UpdateUserParams = req.body;

      const avatar = req.file
        ? await sharp(req.file.buffer).resize(64, 64).avif().toBuffer()
        : undefined;

      const user = await UserModel.findByIdAndUpdate(
        uid,
        {
          name,
          mail,
          avatar,
          password,
          displayName,
          description,
        },
        { new: true }
      )
        .orFail(new AuthError(AuthErrorType.UNKNOWN_USER))
        .exec();

      return res
        .status(203)
        .json(user.toJSON({ user: { avatarLink: `${req.path}/avatar` } }));
    } catch (e) {
      return next(e);
    }
  }
);

routes.get("/:uid/avatar", async (req, res, next) => {
  const { uid } = req.params;

  try {
    const user = await UserModel.findById(uid).select("avatar").lean().exec();
    if (!user || !user.avatar) return res.sendStatus(404);
    return renderAvatar(user.avatar, res);
  } catch (e) {
    return next(e);
  }
});

///TODO: add delete
routes.delete("/:uid?");

export default routes;
