import express from "express";
import session from "cookie-session";
import cors from "cors";
import morgan from "morgan";

import authRoute from "./routes/auth";
import userRoute from "./routes/user";

const app = express();

const { SESSION_SECRET } = process.env;

app.use(
  session({
    name: "__session__",
    keys: SESSION_SECRET!.split(","),
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));

app.use("/auth", authRoute);
app.use("/users", userRoute);

export default app;
