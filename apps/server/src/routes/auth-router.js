import { authController } from "#controllers";
import { Router } from "express";
import { authHandler } from "#middlewares";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authHandler, authController.logout);
router.post("/refresh", authController.refresh);

export default router;
