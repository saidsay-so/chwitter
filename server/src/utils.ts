import { promisify } from "util";
import { BinaryLike, scrypt } from "crypto";
import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";

export const hash = promisify<BinaryLike, BinaryLike, number, Buffer>(scrypt);

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
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

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    console.error(err.errors);
    return res.status(400).json({ error: err.errors });
  }

  console.error(err);
  return res.sendStatus(500);
};
