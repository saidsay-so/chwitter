import mongoose from "mongoose";

export const connect = (url: string, opts?: mongoose.ConnectOptions) => {
  return mongoose.connect(url, opts);
};

export const disconnect = () => mongoose.disconnect();
