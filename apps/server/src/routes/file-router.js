import { fileController } from "#controllers";
import { Router } from "express";

const router = Router();

router.post("/", fileController.uploadFile);
router.get("/:name", fileController.getFile);

export default router;
