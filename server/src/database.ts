import mongoose from "mongoose";

const { MONGO_URL } = process.env;

export const connect = (url?: string, opts?: mongoose.ConnectOptions) =>
  mongoose.connect(url ?? MONGO_URL!, opts);

export const disconnect = () => mongoose.disconnect();
