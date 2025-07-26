import express from "express";
import specializationController from "#controllers";

const {
    getAllSpecializations,
    getSpecializationById,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization,
    getAvailableSpecializations,
} = specializationController;

const router = express.Router();

/**
 * @route   POST /api/specializations/all
 * @desc    Get all specializations with optional filtering and pagination
 * @access  Public
 */
router.post("/all", getAllSpecializations);

/**
 * @route   POST /api/specializations/:id
 * @desc    Get a single specialization by ID with optional doctor details
 * @access  Public
 */
router.post("/:id", getSpecializationById);

/**
 * @route   POST /api/specializations
 * @desc    Create a new specialization
 * @access  Private (Admin only - add auth middleware)
 */
router.post("/", createSpecialization);

/**
 * @route   PUT /api/specializations/:id
 * @desc    Update an existing specialization
 * @access  Private (Admin only - add auth middleware)
 */
router.put("/:id", updateSpecialization);

/**
 * @route   DELETE /api/specializations/:id
 * @desc    Delete a specialization
 * @access  Private (Admin only - add auth middleware)
 */
router.delete("/:id", deleteSpecialization);

/**
 * @route   POST /api/specializations/available
 * @desc    Get specializations with available doctors for appointment booking
 * @access  Public
 */
router.post("/available", getAvailableSpecializations);

// Export the router
export { router as specializationRouter };
