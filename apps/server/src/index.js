import createApp from "./app.js";
import dotenv from "dotenv";
import { connect } from "#utils";
import "#models";
import { userRouter, authRouter } from "#routes";

dotenv.config({ path: ".env.dev" });

const { PORT } = process.env;

const app = createApp();
connect();
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen({ port: PORT }, () => {
    console.log(`Server listening on port ${PORT}`);
});
