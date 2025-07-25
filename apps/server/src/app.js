import express from "express";

export default function createApp() {
    const app = express();

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    return app;
}
