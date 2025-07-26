import createApp from "./app.js";
import dotenv from "dotenv";

import { connect } from "#utils";
import { seed } from "#utils";

const NODE_ENV = process.env.NODE_ENV;
const ENV_PATH = NODE_ENV === "production" ? ".env.prod" : ".env.dev";

dotenv.config({ path: ENV_PATH });

const { PORT } = process.env;

await connect();
await seed();
const app = createApp();

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
