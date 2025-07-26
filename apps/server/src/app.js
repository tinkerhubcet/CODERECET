import express from "express";
import { authRouter, userRouter } from "#routes";

export default function createApp() {
    const app = express();
    app.use("/auth", authRouter);
    app.use("/user", userRouter);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return app;
}
