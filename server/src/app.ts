import express from "express";
import session from "cookie-session";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import messageRoute from "./routes/message";
import { errorHandler } from "./utils";

const app = express();

const { SESSION_SECRETS } = process.env;

app.use(
  session({
    name: "__session__",
    keys: SESSION_SECRETS!.split("|"),
  })
);
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/messages", messageRoute);

app.use(errorHandler);

export default app;
