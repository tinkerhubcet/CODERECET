import { Op } from "sequelize";
import { Specialization, Doctor, Hospital } from "#models";
import { asyncErrorHandler } from "#middlewares";

/**
 * Get all specializations with optional filtering and pagination
 *
 * Request Body Example:
 * {
 *   "search": "cardio",        // Optional: Search in name and description
 *   "limit": 10,               // Optional: Number of results per page (default: 20)
 *   "offset": 0,               // Optional: Pagination offset (default: 0)
 *   "includeDoctorCount": true // Optional: Include count of doctors per specialization
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": {
 *     "specializations": [
 *       {
 *         "id": 1,
 *         "name": "Cardiology",
 *         "description": "Heart and cardiovascular system specialist",
 *         "doctorCount": 5,
 *         "createdAt": "2024-01-15T10:30:00.000Z",
 *         "updatedAt": "2024-01-15T10:30:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "total": 15,
 *       "limit": 10,
 *       "offset": 0,
 *       "hasMore": true
 *     }
 *   }
 * }
 */
const getAllSpecializations = asyncErrorHandler(async (req, res) => {
    try {
        const {
            search,
            limit = 20,
            offset = 0,
            includeDoctorCount = false,
        } = req.body;

        // Build where clause for search functionality
        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        // Build include array for doctor count if requested
        const includeArray = [];
        if (includeDoctorCount) {
            includeArray.push({
                model: Doctor,
                as: "doctors",
                attributes: [], // Don't return doctor data, just count
                required: false,
            });
        }

        // Get total count for pagination
        const totalCount = await Specialization.count({ where: whereClause });

        // Fetch specializations
        const specializations = await Specialization.findAll({
            where: whereClause,
            include: includeArray,
            attributes: includeDoctorCount
                ? [
                      "id",
                      "name",
                      "description",
                      "createdAt",
                      "updatedAt",
                      [
                          Specialization.sequelize.fn(
                              "COUNT",
                              Specialization.sequelize.col("doctors.id"),
                          ),
                          "doctorCount",
                      ],
                  ]
                : ["id", "name", "description", "createdAt", "updatedAt"],
            group: includeDoctorCount ? ["Specialization.id"] : undefined,
            order: [["name", "ASC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        // Format response data
        const formattedSpecializations = specializations.map((spec) => {
            const data = {
                id: spec.id,
                name: spec.name,
                description: spec.description,
                createdAt: spec.createdAt,
                updatedAt: spec.updatedAt,
            };

            if (includeDoctorCount) {
                data.doctorCount = parseInt(spec.dataValues.doctorCount) || 0;
            }

            return data;
        });

        res.json({
            success: true,
            data: {
                specializations: formattedSpecializations,
                pagination: {
                    total: totalCount,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: parseInt(offset) + parseInt(limit) < totalCount,
                },
            },
            message: `Found ${formattedSpecializations.length} specializations`,
        });
    } catch (error) {
        console.error("Error fetching specializations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching specializations",
        });
    }
});

/**
 * Get a single specialization by ID with optional doctor details
 *
 * Request Params: /specializations/:id
 *
 * Request Body Example:
 * {
 *   "includeDoctors": true,     // Optional: Include doctors in this specialization
 *   "includeHospitals": false   // Optional: Include hospitals (via doctors)
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "name": "Cardiology",
 *     "description": "Heart and cardiovascular system specialist",
 *     "doctorCount": 3,
 *     "doctors": [
 *       {
 *         "id": 5,
 *         "name": "Dr. Smith",
 *         "qualifications": "MD, FACC",
 *         "hospital": {
 *           "name": "City Hospital"
 *         }
 *       }
 *     ],
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "updatedAt": "2024-01-15T10:30:00.000Z"
 *   }
 * }
 */
const getSpecializationById = asyncErrorHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { includeDoctors = false, includeHospitals = false } = req.body;

        // Validate ID parameter
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: "Valid specialization ID is required",
            });
        }

        // Build include array based on request options
        const includeArray = [];
        if (includeDoctors) {
            const doctorInclude = {
                model: Doctor,
                as: "doctors",
                attributes: ["id", "name", "qualifications"],
            };

            if (includeHospitals) {
                doctorInclude.include = [
                    {
                        model: Hospital,
                        as: "hospital",
                        attributes: ["id", "name", "address"],
                    },
                ];
            }

            includeArray.push(doctorInclude);
        }

        // Fetch specialization
        const specialization = await Specialization.findByPk(id, {
            include: includeArray,
        });

        if (!specialization) {
            return res.status(404).json({
                success: false,
                message: "Specialization not found",
            });
        }

        // Format response data
        const responseData = {
            id: specialization.id,
            name: specialization.name,
            description: specialization.description,
            createdAt: specialization.createdAt,
            updatedAt: specialization.updatedAt,
        };

        if (includeDoctors) {
            responseData.doctorCount = specialization.doctors
                ? specialization.doctors.length
                : 0;
            responseData.doctors = specialization.doctors || [];
        }

        res.json({
            success: true,
            data: responseData,
            message: "Specialization retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching specialization:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching specialization",
        });
    }
});

/**
 * Get specializations with available doctors (for appointment booking)
 *
 * Request Body Example:
 * {
 *   "date": "2024-03-15",      // Optional: Filter by date for available slots
 *   "hospitalId": 1            // Optional: Filter by hospital
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "Cardiology",
 *       "description": "Heart specialist",
 *       "availableDoctors": 3,
 *       "doctors": [
 *         {
 *           "id": 5,
 *           "name": "Dr. Smith",
 *           "hospital": "City Hospital"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
const getAvailableSpecializations = asyncErrorHandler(async (req, res) => {
    try {
        const { date, hospitalId } = req.body;

        // Build doctor filter conditions
        const doctorWhereClause = {};
        if (hospitalId) doctorWhereClause.hospitalId = hospitalId;

        // Build include for doctors
        const doctorInclude = {
            model: Doctor,
            as: "doctors",
            where: doctorWhereClause,
            attributes: ["id", "name"],
            required: true, // Only return specializations that have doctors
            include: [
                {
                    model: Hospital,
                    as: "hospital",
                    attributes: ["id", "name"],
                },
            ],
        };

        // If date is provided, add schedule filtering
        if (date) {
            const requestedDate = new Date(date);
            if (isNaN(requestedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format. Use YYYY-MM-DD",
                });
            }

            const dayOfWeek = requestedDate.getDay();

            doctorInclude.include.push({
                model: DoctorSchedule,
                as: "schedule",
                where: { day_of_week: dayOfWeek },
                required: true,
                attributes: [],
            });
        }

        // Fetch specializations with available doctors
        const specializations = await Specialization.findAll({
            include: [doctorInclude],
            order: [["name", "ASC"]],
        });

        // Format response data
        const formattedSpecializations = specializations.map((spec) => ({
            id: spec.id,
            name: spec.name,
            description: spec.description,
            availableDoctors: spec.doctors.length,
            doctors: spec.doctors.map((doctor) => ({
                id: doctor.id,
                name: doctor.name,
                hospital: doctor.hospital?.name || "Unknown",
            })),
        }));

        res.json({
            success: true,
            data: formattedSpecializations,
            message: `Found ${formattedSpecializations.length} specializations with available doctors`,
        });
    } catch (error) {
        console.error("Error fetching available specializations:", error);
        res.status(500).json({
            success: false,
            message:
                "Internal server error while fetching available specializations",
        });
    }
});

export default {
    getAllSpecializations,
    getSpecializationById,
    getAvailableSpecializations,
};
