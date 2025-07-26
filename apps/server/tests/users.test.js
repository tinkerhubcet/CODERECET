import request from "supertest";
import { describe, test, expect } from "vitest";
import createApp from "#app";

const app = createApp();
describe("User Routes", () => {
    test("POST /user/register", async () => {
        let result = await request(app)
            .post("/user")
            .send({
                body: {
                    email: "sharonpshajan@gmail.com",
                    password: "password123",
                },
            });
        console.log(result);
        expect(result.status).toBe(201);
        expect(result.body).toEqual({
            ok: true,
            message: "Registered successfully",
            data: null,
        });
    });
});
