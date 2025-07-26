import createApp from "./app.js";
import dotenv from "dotenv";
import { connect } from "./utils/connect.js";

dotenv.config({ path: ".env.dev" });

const { PORT } = process.env;

const app = createApp();
connect();

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
