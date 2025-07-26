import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { authRouter, userRouter, fileRouter, appointmentRouter } from "#routes";

export default function createApp() {
    const app = express();
    app.use(bodyParser.json());

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
    apiV1Router.use("/file", fileRouter);
    apiV1Router.use("/appointment", appointmentRouter);

    app.use("/api/v1", apiV1Router);
    return app;
}
