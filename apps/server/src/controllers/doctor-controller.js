import { Op } from "sequelize";
import { Specialization, Doctor } from "#models";

/**
 * @description List doctors, with optional filtering by hospital or specialization.
 * @route GET /api/doctors?hospital_id=1&specialization_id=5
 */
async function listDoctors(req, res) {
    try {
        const { hospital_id, specialization_id } = req.query;
        const filter = {
            where: {},
            include: [
                {
                    model: Specialization,
                    as: "specializations",
                    attributes: ["id", "name"],
                    through: { attributes: [] }, // Don't include join table attributes
                },
            ],
        };

        if (hospital_id) {
            filter.where.hospital_id = hospital_id;
        }
        if (specialization_id) {
            // Filter by the associated specialization's ID
            filter.include[0].where = { id: specialization_id };
        }

        const doctors = await Doctor.findAll(filter);
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({
            message: "Error fetching doctors",
            error: error.message,
        });
    }
}

/**
 * @description Get all available appointment slots for a doctor on a specific date.
 * @route GET /api/doctors/:id/availability?date=YYYY-MM-DD
 */
async function getDoctorAvailability(req, res) {
    try {
        const { id } = req.params;
        const { date } = req.query; // e.g., '2025-07-26'

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                message: "A valid date in YYYY-MM-DD format is required.",
            });
        }

        const targetDate = new Date(date);
        const dayOfWeek = targetDate.getUTCDay(); // 0 for Sunday, 1 for Monday...

        // 1. Get the doctor's schedule for the specified day of the week
        const schedule = await DoctorSchedule.findOne({
            where: { doctor_id: id, day_of_week: dayOfWeek },
        });
        if (!schedule) {
            return res.status(200).json({
                message: "Doctor is not available on this day.",
                availableSlots: [],
            });
        }

        // 2. Find all appointments already booked for that doctor on that day
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        db.A;
        const bookedAppointments = await db.Appointment.findAll({
            where: {
                doctor_id: id,
                status: "SCHEDULED",
                appointment_time: { [Op.between]: [startOfDay, endOfDay] },
            },
            attributes: ["appointment_time"],
        });
        const bookedSlots = new Set(
            bookedAppointments.map((a) => a.appointment_time.toISOString()),
        );

        // 3. Generate all potential slots based on schedule and filter out booked ones
        const availableSlots = [];
        const { start_time, end_time, slot_duration_minutes } = schedule;
        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = end_time.split(":").map(Number);

        let currentSlot = new Date(date);
        currentSlot.setUTCHours(startHour, startMinute, 0, 0);

        const endSlotTime = new Date(date);
        endSlotTime.setUTCHours(endHour, endMinute, 0, 0);

        while (currentSlot < endSlotTime) {
            if (!bookedSlots.has(currentSlot.toISOString())) {
                availableSlots.push(new Date(currentSlot));
            }
            currentSlot.setMinutes(
                currentSlot.getMinutes() + slot_duration_minutes,
            );
        }

        res.status(200).json({ availableSlots });
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({
            message: "Error fetching availability",
            error: error.message,
        });
    }
}

export default {
    listDoctors,
    getDoctorAvailability,
};
