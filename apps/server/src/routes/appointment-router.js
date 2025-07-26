import { Router } from "express";
import { appointmentController } from "#controllers";

const appointmentRouter = Router();

appointmentRouter.get(
    "/my-appointments",
    appointmentController.listMyAppointments,
);
appointmentRouter.post("/book", appointmentController.bookAppointment);
appointmentRouter.patch("/:id/cancel", appointmentController.cancelAppointment);

export default appointmentRouter;
