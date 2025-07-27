import { Router } from "express";
import { appointmentController } from "#controllers";

const appointmentRouter = Router();

appointmentRouter.post(
    "/available-slots",
    appointmentController.getAvailableSlots,
);
appointmentRouter.post(
    "/my-appointments",
    appointmentController.getUserAppointments,
);
appointmentRouter.post("/book", appointmentController.bookAppointment);
appointmentRouter.post("/cancel", appointmentController.cancelAppointment);

export default appointmentRouter;
