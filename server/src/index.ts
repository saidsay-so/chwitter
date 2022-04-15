import "./@config";
import assert from "assert";
import app from "./app";
import { connect } from "./database";

const { SERVER_PORT, MONGO_URL } = process.env;

assert(SERVER_PORT, "Port is not defined");
assert(MONGO_URL, "Database URL is not defined");

app.listen(parseInt(SERVER_PORT), async () => {
  try {
    await connect(MONGO_URL);
  } catch (e) {
    throw e;
  }

  console.log(`Server listening on port ${SERVER_PORT}`);
});
