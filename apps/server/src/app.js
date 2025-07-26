import express from "express";
import { authRouter, userRouter } from "#routes";

export default function createApp() {
    const app = express();
    const apiV1Router = express.Router();

    apiV1Router.use("/auth", authRouter);
    apiV1Router.use("/user", userRouter);

    app.use("/api/v1", apiV1Router);
    return app;
}
