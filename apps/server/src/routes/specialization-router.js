import express from "express";
import { specializationController } from "#controllers";
import { authHandler } from "#middlewares";

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
 * @route   POST /api/specializations/available
 * @desc    Get specializations with available doctors for appointment booking
 * @access  Public
 */
router.post("/available", authHandler, getAvailableSpecializations);

// Export the router
export default router;
