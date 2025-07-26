import { Op } from "sequelize";
import { ErrorHandler, AsyncErrorHandler } from "#utils";
import {
    Appointment,
    Doctor,
    DoctorSchedule,
    Specialization,
    Hospital,
    User,
} from "#models";

/**
 * Get available appointment slots
 *
 * Request Body Example:
 * {
 *   "date": "2024-03-15",           // Required: YYYY-MM-DD format
 *   "specializationId": 2,          // Optional: Filter by specialization
 *   "doctorId": 5,                  // Optional: Filter by specific doctor
 *   "hospitalId": 1                 // Optional: Filter by hospital
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "doctorId": 1,
 *       "doctorName": "Dr. Smith",
 *       "specialization": "Cardiology",
 *       "hospital": "City Hospital",
 *       "availableSlots": [
 *         {
 *           "time": "09:00:00",
 *           "datetime": "2024-03-15T09:00:00.000Z"
 *         },
 *         {
 *           "time": "09:15:00",
 *           "datetime": "2024-03-15T09:15:00.000Z"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
const getAvailableSlots = AsyncErrorHandler(async (req, res) => {
    try {
        const { date, specializationId, doctorId, hospitalId } = req.body;

        // Validate required date parameter
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required in YYYY-MM-DD format",
            });
        }

        // Parse and validate date format
        const requestedDate = new Date(date);
        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD",
            });
        }

        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = requestedDate.getDay();

        // Build doctor filter conditions
        const doctorWhereClause = {};
        if (doctorId) doctorWhereClause.id = doctorId;
        if (specializationId)
            doctorWhereClause.specializationId = specializationId;
        if (hospitalId) doctorWhereClause.hospitalId = hospitalId;

        // Find doctors with schedules for the requested day
        const doctorsWithSchedules = await Doctor.findAll({
            where: doctorWhereClause,
            include: [
                {
                    model: DoctorSchedule,
                    as: "schedule",
                    where: { day_of_week: dayOfWeek },
                    required: true,
                },
                {
                    model: Specialization,
                    as: "specialization",
                    attributes: ["id", "name"],
                },
                {
                    model: Hospital,
                    as: "hospital",
                    attributes: ["id", "name"],
                },
                {
                    model: Appointment,
                    as: "appointments",
                    where: {
                        appointment_time: {
                            [Op.between]: [
                                new Date(date + "T00:00:00.000Z"),
                                new Date(date + "T23:59:59.999Z"),
                            ],
                        },
                        status: { [Op.ne]: "CANCELLED" },
                    },
                    required: false, // LEFT JOIN to get all doctors even without appointments
                },
            ],
        });

        const availableSlotsData = [];

        // Process each doctor's schedule
        for (const doctor of doctorsWithSchedules) {
            const schedule = doctor.schedule;
            const existingAppointments = doctor.appointments || [];

            // Generate all possible time slots for the day
            const slots = generateTimeSlots(
                schedule.start_time,
                schedule.end_time,
                schedule.slot_duration_minutes,
            );

            // Filter out booked slots
            const bookedTimes = existingAppointments.map((apt) => {
                const time = new Date(apt.appointment_time);
                return time.toTimeString().split(" ")[0]; // Get HH:MM:SS format
            });

            const availableSlots = slots
                .filter((slot) => !bookedTimes.includes(slot.time))
                .map((slot) => ({
                    time: slot.time,
                    datetime: new Date(`${date}T${slot.time}.000Z`),
                }));

            // Only include doctors with available slots
            if (availableSlots.length > 0) {
                availableSlotsData.push({
                    doctorId: doctor.id,
                    doctorName: doctor.name,
                    specialization: doctor.specialization?.name || "General",
                    hospital: doctor.hospital?.name || "Unknown",
                    availableSlots: availableSlots,
                });
            }
        }

        res.json({
            success: true,
            data: availableSlotsData,
            message: `Found ${availableSlotsData.length} doctors with available slots for ${date}`,
        });
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching available slots",
        });
    }
});

/**
 * Book an appointment slot
 *
 * Request Body Example:
 * {
 *   "userId": 123,                           // Required: ID of the user booking
 *   "doctorId": 5,                          // Required: ID of the doctor
 *   "appointmentTime": "2024-03-15T09:00:00.000Z", // Required: ISO datetime
 *   "notes": "Regular checkup appointment"   // Optional: Additional notes
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 456,
 *     "userId": 123,
 *     "doctorId": 5,
 *     "appointment_time": "2024-03-15T09:00:00.000Z",
 *     "status": "SCHEDULED",
 *     "notes": "Regular checkup appointment",
 *     "doctor": {
 *       "name": "Dr. Smith",
 *       "specialization": "Cardiology"
 *     }
 *   },
 *   "message": "Appointment booked successfully"
 * }
 */

const bookAppointment = AsyncErrorHandler(async (req, res) => {
    try {
        const { userId, doctorId, appointmentTime, notes } = req.body;

        // Validate required fields
        if (!userId || !doctorId || !appointmentTime) {
            return res.status(400).json({
                success: false,
                message: "userId, doctorId, and appointmentTime are required",
            });
        }

        // Validate appointment time format
        const appointmentDate = new Date(appointmentTime);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointmentTime format. Use ISO datetime format",
            });
        }

        // Check if appointment time is in the future
        if (appointmentDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Appointment time must be in the future",
            });
        }

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify doctor exists and get their schedule
        const doctor = await Doctor.findByPk(doctorId, {
            include: [
                {
                    model: DoctorSchedule,
                    as: "schedule",
                },
                {
                    model: Specialization,
                    as: "specialization",
                    attributes: ["name"],
                },
            ],
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        // Check if doctor has schedule for the requested day
        const dayOfWeek = appointmentDate.getDay();
        if (!doctor.schedule || doctor.schedule.day_of_week !== dayOfWeek) {
            return res.status(400).json({
                success: false,
                message: "Doctor is not available on the selected day",
            });
        }

        // Validate appointment time is within doctor's working hours
        const appointmentTimeString = appointmentDate
            .toTimeString()
            .split(" ")[0];
        if (
            appointmentTimeString < doctor.schedule.start_time ||
            appointmentTimeString > doctor.schedule.end_time
        ) {
            return res.status(400).json({
                success: false,
                message: "Appointment time is outside doctor's working hours",
            });
        }

        // Check if slot is already booked
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId: doctorId,
                appointment_time: appointmentDate,
                status: { [Op.ne]: "CANCELLED" },
            },
        });

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message: "This time slot is already booked",
            });
        }

        // Create the appointment
        const newAppointment = await Appointment.create({
            userId: userId,
            doctorId: doctorId,
            appointment_time: appointmentDate,
            status: "SCHEDULED",
            notes: notes || null,
        });

        // Fetch the created appointment with doctor details
        const appointmentWithDetails = await Appointment.findByPk(
            newAppointment.id,
            {
                include: [
                    {
                        model: Doctor,
                        as: "doctor",
                        attributes: ["id", "name"],
                        include: [
                            {
                                model: Specialization,
                                as: "specialization",
                                attributes: ["name"],
                            },
                        ],
                    },
                ],
            },
        );

        res.status(201).json({
            success: true,
            data: {
                id: appointmentWithDetails.id,
                userId: appointmentWithDetails.userId,
                doctorId: appointmentWithDetails.doctorId,
                appointment_time: appointmentWithDetails.appointment_time,
                status: appointmentWithDetails.status,
                notes: appointmentWithDetails.notes,
                doctor: {
                    name: appointmentWithDetails.doctor.name,
                    specialization:
                        appointmentWithDetails.doctor.specialization?.name ||
                        "General",
                },
            },
            message: "Appointment booked successfully",
        });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while booking appointment",
        });
    }
});

/**
 * Cancel an appointment
 *
 * Request Body Example:
 * {
 *   "appointmentId": 456,    // Required: ID of the appointment to cancel
 *   "userId": 123           // Required: ID of the user (for authorization)
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": {
 *     "id": 456,
 *     "status": "CANCELLED",
 *     "appointment_time": "2024-03-15T09:00:00.000Z",
 *     "doctor": {
 *       "name": "Dr. Smith"
 *     }
 *   },
 *   "message": "Appointment cancelled successfully"
 * }
 */
const cancelAppointment = AsyncErrorHandler(async (req, res) => {
    try {
        const { appointmentId, userId } = req.body;

        // Validate required fields
        if (!appointmentId || !userId) {
            return res.status(400).json({
                success: false,
                message: "appointmentId and userId are required",
            });
        }

        // Find the appointment
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["name"],
                },
            ],
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        // Verify the appointment belongs to the user
        if (appointment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this appointment",
            });
        }

        // Check if appointment is already cancelled
        if (appointment.status === "CANCELLED") {
            return res.status(400).json({
                success: false,
                message: "Appointment is already cancelled",
            });
        }

        // Check if appointment is already completed
        if (appointment.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed appointment",
            });
        }

        // Check if appointment is in the past (optional business rule)
        if (new Date(appointment.appointment_time) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel past appointments",
            });
        }

        // Update appointment status to cancelled
        await appointment.update({ status: "CANCELLED" });

        res.json({
            success: true,
            data: {
                id: appointment.id,
                status: appointment.status,
                appointment_time: appointment.appointment_time,
                doctor: {
                    name: appointment.doctor.name,
                },
            },
            message: "Appointment cancelled successfully",
        });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while cancelling appointment",
        });
    }
});

/**
 * Get user's appointments
 *
 * Request Body Example:
 * {
 *   "userId": 123,                    // Required: ID of the user
 *   "status": "SCHEDULED",           // Optional: Filter by status (SCHEDULED, COMPLETED, CANCELLED)
 *   "fromDate": "2024-03-01",       // Optional: Filter appointments from this date
 *   "toDate": "2024-03-31",         // Optional: Filter appointments until this date
 *   "limit": 10,                    // Optional: Number of results per page (default: 20)
 *   "offset": 0                     // Optional: Pagination offset (default: 0)
 * }
 *
 * Response Example:
 * {
 *   "success": true,
 *   "data": {
 *     "appointments": [
 *       {
 *         "id": 456,
 *         "appointment_time": "2024-03-15T09:00:00.000Z",
 *         "status": "SCHEDULED",
 *         "notes": "Regular checkup",
 *         "doctor": {
 *           "id": 5,
 *           "name": "Dr. Smith",
 *           "specialization": "Cardiology",
 *           "hospital": "City Hospital"
 *         },
 *         "createdAt": "2024-03-10T10:30:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "total": 25,
 *       "limit": 10,
 *       "offset": 0,
 *       "hasMore": true
 *     }
 *   }
 * }
 */
const getUserAppointments = AsyncErrorHandler(async (req, res) => {
    try {
        const {
            userId,
            status,
            fromDate,
            toDate,
            limit = 20,
            offset = 0,
        } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Build where clause for appointments
        const whereClause = { userId: userId };

        // Add status filter if provided
        if (status) {
            if (!["SCHEDULED", "COMPLETED", "CANCELLED"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid status. Must be SCHEDULED, COMPLETED, or CANCELLED",
                });
            }
            whereClause.status = status;
        }

        // Add date range filter if provided
        if (fromDate || toDate) {
            whereClause.appointment_time = {};

            if (fromDate) {
                const from = new Date(fromDate + "T00:00:00.000Z");
                if (isNaN(from.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid fromDate format. Use YYYY-MM-DD",
                    });
                }
                whereClause.appointment_time[Op.gte] = from;
            }

            if (toDate) {
                const to = new Date(toDate + "T23:59:59.999Z");
                if (isNaN(to.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid toDate format. Use YYYY-MM-DD",
                    });
                }
                whereClause.appointment_time[Op.lte] = to;
            }
        }

        // Get total count for pagination
        const totalCount = await Appointment.count({ where: whereClause });

        // Fetch appointments with doctor details
        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Specialization,
                            as: "specialization",
                            attributes: ["name"],
                        },
                        {
                            model: Hospital,
                            as: "hospital",
                            attributes: ["name"],
                        },
                    ],
                },
            ],
            order: [["appointment_time", "ASC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        // Format response data
        const formattedAppointments = appointments.map((appointment) => ({
            id: appointment.id,
            appointment_time: appointment.appointment_time,
            status: appointment.status,
            notes: appointment.notes,
            doctor: {
                id: appointment.doctor.id,
                name: appointment.doctor.name,
                specialization:
                    appointment.doctor.specialization?.name || "General",
                hospital: appointment.doctor.hospital?.name || "Unknown",
            },
            createdAt: appointment.createdAt,
        }));

        res.json({
            success: true,
            data: {
                appointments: formattedAppointments,
                pagination: {
                    total: totalCount,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    hasMore: parseInt(offset) + parseInt(limit) < totalCount,
                },
            },
            message: `Found ${formattedAppointments.length} appointments`,
        });
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching appointments",
        });
    }
});

/**
 * Helper function to generate time slots based on schedule
 * @param {string} startTime - Start time in HH:MM:SS format
 * @param {string} endTime - End time in HH:MM:SS format
 * @param {number} slotDuration - Duration of each slot in minutes
 * @returns {Array} Array of time slot objects
 */
function generateTimeSlots(startTime, endTime, slotDuration) {
    const slots = [];

    // Parse start and end times
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Convert to minutes for easier calculation
    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Generate slots
    while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;

        const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;

        slots.push({
            time: timeString,
        });

        currentMinutes += slotDuration;
    }

    return slots;
}

export default {
    getAvailableSlots,
    bookAppointment,
    cancelAppointment,
    getUserAppointments,
};
