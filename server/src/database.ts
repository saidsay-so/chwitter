import mongoose from "mongoose";

const { MONGO_URL } = process.env;

export const connect = () => mongoose.connect(MONGO_URL!);
