import "./@config";
import app from "./app";
import { connect } from "./database";

const { SERVER_PORT } = process.env;

app.listen(parseInt(SERVER_PORT!), async () => {
  try {
    await connect();
  } catch (e) {
    console.error(e);
  }

  console.log(`Server listening on port ${SERVER_PORT}`);
});
