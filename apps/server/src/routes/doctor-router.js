import { Router } from "express";
import { doctorController } from "#controllers";

const doctorRouter = Router();

doctorRouter.get("/", doctorController.listDoctors);
doctorRouter.get("/:id/availability", doctorController.getDoctorAvailability);

export default doctorRouter;
