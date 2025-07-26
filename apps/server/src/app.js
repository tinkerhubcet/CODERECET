import express from "express";
import cors from "cors";

import { authRouter, userRouter } from "#routes";

export default function createApp() {
    const app = express();

    app.use(
        cors({
            origin: [
                "https://vitalis-client.vercel.app",
                "http://localhost:3000",
            ],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }),
    );

    const apiV1Router = express.Router();

    apiV1Router.use("/auth", authRouter);
    apiV1Router.use("/user", userRouter);

    app.use("/api/v1", apiV1Router);
    return app;
}
