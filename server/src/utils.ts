import { promisify } from "util";
import { scrypt } from "crypto";
import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";

export const hash = promisify(scrypt);

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.active) {
    return res.sendStatus(401);
  }

  return next();
};

export const checkRights: RequestHandler = (req, res, next) => {
  const { uid } = req.params;

  if (uid && uid !== req.session.userId) {
    return res.sendStatus(403);
  }

  return next();
};

export const errorHandle: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    console.error(err.errors);
    return res.status(400).json({ error: err.errors });
  }
};
