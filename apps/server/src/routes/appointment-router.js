import { Router } from "express";
import { authHandler } from "#middlewares";
import { appointmentController } from "#controllers";

const appointmentRouter = Router();

appointmentRouter.use(authHandler); // Secure all appointment routes
appointmentRouter.get(
    "/my-appointments",
    appointmentController.listMyAppointments,
);
appointmentRouter.post("/book", appointmentController.bookAppointment);
appointmentRouter.patch("/:id/cancel", appointmentController.cancelAppointment);

export default appointmentRouter;
