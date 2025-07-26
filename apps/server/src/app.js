import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import {
    authRouter,
    userRouter,
    fileRouter,
    appointmentRouter,
    doctorRouter,
    prescriptionRouter,
    specializationRouter,
} from "#routes";
import { authHandler } from "#middlewares";

export default function createApp() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cookieParser());

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
    apiV1Router.use("/user", authHandler, userRouter);
    apiV1Router.use("/file", authHandler, fileRouter);
    apiV1Router.use("/appointment", authHandler, appointmentRouter);
    apiV1Router.use("/prescription", authHandler, prescriptionRouter);
    apiV1Router.use("/doctor", authHandler, doctorRouter);
    apiV1Router.use("/specialization", specializationRouter);

    app.use("/api/v1", apiV1Router);
    return app;
}
