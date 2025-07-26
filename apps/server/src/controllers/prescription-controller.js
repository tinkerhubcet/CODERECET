import { Prescription } from "#models";
import { ErrorHandler, asyncErrorHandler } from "#middlewares";

const getPrescriptions = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescriptions = await Prescription.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
    });
    if (prescriptions instanceof ErrorHandler) return next(prescriptions);
    res.status(200).json(prescriptions);
});

const getPrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescription = await Prescription.findOne({
        where: { id: req.params.id, userId },
    });
    if (prescription instanceof ErrorHandler) return next(prescription);
    res.status(200).json(prescription);
});

const createPrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescription = await Prescription.create({
        userId,
        ...req.body,
    });
    if (prescription instanceof ErrorHandler) return next(prescription);
    res.status(201).json(prescription);
});

const updatePrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescription = await Prescription.update(
        req.params.id,
        {
            userId,
            ...req.body,
        },
        { where: { id: req.params.id, userId } },
    );
    if (prescription instanceof ErrorHandler) return next(prescription);
    res.status(200).json(prescription);
});

const deletePrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescription = await Prescription.destroy({
        where: { id: req.params.id, userId },
    });
    if (prescription instanceof ErrorHandler) return next(prescription);
    res.status(200).json(prescription);
});

export default {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription,
};
