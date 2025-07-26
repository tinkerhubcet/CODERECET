import { userController } from "#controllers";
import { Router } from "express";

const router = Router();

router.post("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.removeUser);

export default router;
