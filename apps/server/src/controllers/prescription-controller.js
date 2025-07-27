import { Prescription, Medication, MedicationSchedule } from "#models";
import { ErrorHandler, asyncErrorHandler } from "#middlewares";

/**
 * Prescription Controller
 *
 * Handles all CRUD operations for prescriptions, including nested medications and medication schedules.
 *
 * @module PrescriptionController
 */

/**
 * Get all prescriptions for the authenticated user, including medications and schedules
 *
 * @route GET /api/prescriptions
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {Object} 200 - List of prescriptions with nested medications and schedules
 */
const getPrescriptions = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;

    const prescriptions = await Prescription.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: Medication,
                as: "medications",
                include: [
                    {
                        model: MedicationSchedule,
                        as: "schedules",
                    },
                ],
            },
        ],
    });

    res.status(200).json({
        success: true,
        count: prescriptions.length,
        data: prescriptions,
    });
});

/**
 * Get a single prescription by ID, including medications and their schedules
 *
 * @route GET /api/prescriptions/:id
 * @access Private
 * @param {Object} req - Express request
 * @param {string} req.params.id - Prescription ID
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {Object} 200 - Prescription with medications and schedules
 * @returns {Object} 404 - Prescription not found
 */
const getPrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescriptionId = req.params.id;

    const prescription = await Prescription.findOne({
        where: {
            id: prescriptionId,
            userId,
        },
        include: [
            {
                model: Medication,
                as: "medications",
                include: [
                    {
                        model: MedicationSchedule,
                        as: "schedules",
                    },
                ],
            },
        ],
    });

    if (!prescription) {
        return next(new ErrorHandler("Prescription not found", 404));
    }

    res.status(200).json({
        success: true,
        data: prescription,
    });
});

/**
 * Create a new prescription, optionally including medications and schedules
 *
 * @route POST /api/prescriptions
 * @access Private
 * @param {Object} req - Express request
 * @param {Object} req.body - Prescription data
 * @param {string} req.body.doctorName - Required
 * @param {string} [req.body.clinicName]
 * @param {string} req.body.dateIssued - YYYY-MM-DD
 * @param {string} [req.body.notes]
 * @param {Array<Object>} [req.body.medications] - Medications with optional schedules
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {Object} 201 - Created prescription
 * @example
 * req.body = {
 *   "doctorName": "Dr. Smith",
 *   "clinicName": "Healthy Life Clinic",
 *   "dateIssued": "2025-07-26",
 *   "notes": "Follow-up in 2 weeks",
 *   "medications": [
 *     {
 *       "name": "Paracetamol",
 *       "dosage": "500mg",
 *       "instructions": "Take after meals",
 *       "schedules": [
 *         { "frequency": "Twice daily" }
 *       ]
 *     }
 *   ]
 * }
 */
const createPrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;

    if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ErrorHandler("Prescription data is required", 400));
    }

    const prescriptionData = {
        userId,
        ...req.body,
    };

    const prescription = await Prescription.create(prescriptionData);

    if (req.body.medications && Array.isArray(req.body.medications)) {
        const medications = await Medication.bulkCreate(
            req.body.medications.map((med) => ({
                ...med,
                prescriptionId: prescription.id,
            })),
        );

        for (const medication of medications) {
            if (medication.schedules && Array.isArray(medication.schedules)) {
                await MedicationSchedule.bulkCreate(
                    medication.schedules.map((schedule) => ({
                        ...schedule,
                        medicationId: medication.id,
                    })),
                );
            }
        }
    }

    res.status(201).json({
        success: true,
        message: "Prescription created successfully",
        data: prescription,
    });
});

/**
 * Update an existing prescription and optionally its medications
 *
 * @route PUT /api/prescriptions/:id
 * @access Private
 * @param {Object} req - Express request
 * @param {string} req.params.id - Prescription ID
 * @param {Object} req.body - Fields to update
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {Object} 200 - Updated prescription
 * @example
 * req.body = {
 *   "doctorName": "Dr. John Smith",
 *   "notes": "Changed dosage"
 * }
 */
const updatePrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescriptionId = req.params.id;

    if (!req.body || Object.keys(req.body).length === 0) {
        return next(new ErrorHandler("Update data is required", 400));
    }

    const existingPrescription = await Prescription.findOne({
        where: {
            id: prescriptionId,
            userId,
        },
    });

    if (!existingPrescription) {
        return next(new ErrorHandler("Prescription not found", 404));
    }

    const [updatedRowsCount, updatedPrescriptions] = await Prescription.update(
        {
            ...req.body,
            userId,
        },
        {
            where: {
                id: prescriptionId,
                userId,
            },
            returning: true,
        },
    );

    if (updatedRowsCount === 0) {
        return next(new ErrorHandler("Failed to update prescription", 500));
    }

    const updatedPrescription =
        updatedPrescriptions[0] ||
        (await Prescription.findOne({ where: { id: prescriptionId, userId } }));

    res.status(200).json({
        success: true,
        message: "Prescription updated successfully",
        data: updatedPrescription,
    });
});

/**
 * Delete a prescription along with its medications and schedules
 *
 * @route DELETE /api/prescriptions/:id
 * @access Private
 * @param {Object} req - Express request
 * @param {string} req.params.id - Prescription ID
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {Object} 200 - Deletion success message
 */
const deletePrescription = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const prescriptionId = req.params.id;

    const existingPrescription = await Prescription.findOne({
        where: {
            id: prescriptionId,
            userId,
        },
    });

    if (!existingPrescription) {
        return next(new ErrorHandler("Prescription not found", 404));
    }

    // Medications and schedules are deleted via cascade if associations are properly set
    const deletedRowsCount = await Prescription.destroy({
        where: {
            id: prescriptionId,
            userId,
        },
    });

    if (deletedRowsCount === 0) {
        return next(new ErrorHandler("Failed to delete prescription", 500));
    }

    res.status(200).json({
        success: true,
        message: "Prescription deleted successfully",
    });
});

/**
 * Export all prescription controller methods
 */
export default {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription,
};
