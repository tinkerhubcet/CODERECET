import createApp from "./app.js";
import dotenv from "dotenv";
import { connect } from "#utils";
import seed from "#utils";
import { User, AuthToken } from "#models";

const NODE_ENV = process.env.NODE_ENV;
const ENV_PATH = NODE_ENV === "production" ? ".env.prod" : ".env.dev";

dotenv.config({ path: ENV_PATH });

const { PORT } = process.env;

connect();
User.sync();
AuthToken.sync();
const app = createApp();

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
