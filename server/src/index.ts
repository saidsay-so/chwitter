import "./@config";
import assert from "assert";
import app from "./app";
import { connect } from "./database";

const { PORT, MONGO_URL, CERT } = process.env;

assert(PORT, "Port is not defined");
assert(MONGO_URL, "Database URL is not defined");

app.listen(parseInt(PORT), async () => {
  try {
    await connect(MONGO_URL, { cert: CERT, key: CERT });
  } catch (e) {
    throw e;
  }

  console.log(`Server listening on port ${PORT}`);
});
