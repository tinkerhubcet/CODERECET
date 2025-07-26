import express from "express";
import cors from "cors";

import { authRouter, userRouter } from "#routes";

export default function createApp() {
    const app = express();

    app.use(
        cors({
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        }),
    );

    const apiV1Router = express.Router();

    apiV1Router.use("/auth", authRouter);
    apiV1Router.use("/user", userRouter);

    app.use("/api/v1", apiV1Router);
    return app;
}
