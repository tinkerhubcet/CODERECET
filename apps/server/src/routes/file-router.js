import { fileController } from "#controllers";
import { upload } from "#utils";
import { Router } from "express";

const router = Router();

router.post(
    "/prescription",
    upload.single("file"),
    fileController.uploadPrescriptionFile,
);
router.post("/report", upload.single("file"), fileController.uploadReportFile);
router.get("/", fileController.getFile);

export default router;
