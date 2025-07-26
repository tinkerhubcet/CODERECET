import { fileController } from "#controllers";
import { upload } from "#utils";
import { Router } from "express";

const router = Router();

router.post("/", upload.single("file"), fileController.uploadFile);
// router.get("/:name", fileController.getFile);

export default router;
