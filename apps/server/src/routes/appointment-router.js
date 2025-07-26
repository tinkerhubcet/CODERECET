import { Router } from "express";
import { appointmentController } from "#controllers";

const appointmentRouter = Router();

appointmentRouter.get(
    "/available-slots",
    appointmentController.getAvailableSlots,
);
appointmentRouter.get(
    "/my-appointments",
    appointmentController.getUserAppointments,
);
appointmentRouter.post("/book", appointmentController.bookAppointment);
appointmentRouter.patch("/:id/cancel", appointmentController.cancelAppointment);

export default appointmentRouter;
