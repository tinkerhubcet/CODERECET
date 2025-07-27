import { Router } from "express";
import { prescriptionController } from "#controllers";
import { authHandler } from "#middlewares";

const prescriptionRouter = Router();

prescriptionRouter.get(
    "/",
    authHandler,
    prescriptionController.getPrescriptions,
);

prescriptionRouter.get(
    "/:id",
    authHandler,
    prescriptionController.getPrescription,
);

prescriptionRouter.post(
    "/",
    authHandler,
    prescriptionController.createPrescription,
);

prescriptionRouter.put(
    "/:id",
    authHandler,
    prescriptionController.updatePrescription,
);

prescriptionRouter.delete(
    "/:id",
    authHandler,
    prescriptionController.deletePrescription,
);

export default prescriptionRouter;
