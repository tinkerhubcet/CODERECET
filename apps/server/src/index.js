import createApp from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const { PORT } = process.env;

const app = createApp();

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
