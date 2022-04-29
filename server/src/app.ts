import express, { Router } from "express";
import session from "cookie-session";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import messageRoute from "./routes/message";
import friendRoute from "./routes/friend";
import { errorHandler } from "./utils";
import assert from "assert";

const app = express();

const { SESSION_SECRET } = process.env;
assert(SESSION_SECRET, "Secret is not defined");

app.use(
  session({
    name: "__session__",
    secret: SESSION_SECRET,
  })
);
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const api = Router();

api.use("/auth", authRoute);
api.use("/users", userRoute);
api.use("/messages", messageRoute);
api.use("/friends", friendRoute);

app.use("/api", api);

app.use("/", express.static("public"));
app.use(errorHandler);

export default app;
