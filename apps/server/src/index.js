import createApp from "./app.js";
import dotenv from "dotenv";
import { connect } from "#utils";
import { User, AuthToken } from "#models";

dotenv.config({ path: ".env.dev" });

const { PORT } = process.env;

connect();
User.sync();
AuthToken.sync();
const app = createApp();

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
