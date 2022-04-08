import "./@config";
import app from "./app";

const { SERVER_PORT } = process.env;

app.listen(parseInt(SERVER_PORT), () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
