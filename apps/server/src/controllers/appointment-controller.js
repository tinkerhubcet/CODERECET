import { Appointment } from "#models";

/**
 * @description Book a new appointment.Uses a transaction to prevent race conditions.
 * @route POST / api / appointments / book
 */

async function bookAppointment(req, res) {
    const { doctor_id, appointment_time } = req.body;
    const user_id = req.user.id;

    if (!doctor_id || !appointment_time) {
        return res
            .status(400)
            .json({ message: "doctor_id and appointment_time are required." });
    }

    // Use a database transaction to ensure the check-and-create operation is atomic.
    const transaction = await db.sequelize.transaction();
    try {
        const slotTime = new Date(appointment_time);

        // 1. Check if an appointment for this exact time and doctor already exists.
        const existingAppointment = await Appointment.findOne({
            where: {
                doctor_id,
                appointment_time: slotTime,
                status: "SCHEDULED",
            },
            lock: transaction.LOCK.UPDATE,
            transaction,
        });

        if (existingAppointment) {
            await transaction.rollback();
            return res.status(409).json({
                message:
                    "This appointment slot is no longer available. Please select another time.",
            });
        }

        // 2. If the slot is free, create the new appointment within the transaction.
        const newAppointment = await db.Appointment.create(
            {
                user_id,
                doctor_id,
                appointment_time: slotTime,
                status: "SCHEDULED",
            },
            { transaction },
        );

        // 3. If everything succeeded, commit the transaction to save the changes.
        await transaction.commit();
        res.status(201).json(newAppointment);
    } catch (error) {
        // If any step fails, roll back all changes made during the transaction.
        await transaction.rollback();
        console.error("Failed to book appointment:", error);
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message,
        });
    }
}

/**
 * @description Cancel an existing appointment owned by the user.
 * @route PATCH /api/appointments/:id/cancel
 */
async function cancelAppointment(req, res) {
    const { id } = req.params;
    const user_id = req.user.id; // From auth middleware
    try {
        const appointment = await db.Appointment.findOne({
            where: { id: id, user_id: user_id },
        });

        if (!appointment) {
            return res.status(404).json({
                message:
                    "Appointment not found or you do not have permission to cancel it.",
            });
        }

        if (appointment.status !== "SCHEDULED") {
            return res.status(400).json({
                message: `Cannot cancel an appointment with status: ${appointment.status}`,
            });
        }

        appointment.status = "CANCELLED";
        await appointment.save();

        res.status(200).json({
            message: "Appointment cancelled successfully.",
            appointment,
        });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({
            message: "Error cancelling appointment",
            error: error.message,
        });
    }
}

/**
 * @description List all appointments for the currently authenticated user.
 * @route GET /api/appointments/my-appointments
 */
async function listMyAppointments(req, res) {
    const user_id = req.user.id;
    try {
        const appointments = await db.Appointment.findAll({
            where: { user_id },
            include: [
                {
                    model: db.Doctor,
                    as: "doctor",
                    attributes: ["name", "qualifications"],
                    include: {
                        model: db.Hospital,
                        as: "hospital",
                        attributes: ["name"],
                    },
                },
            ],
            order: [["appointment_time", "DESC"]],
        });
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        res.status(500).json({
            message: "Error fetching appointments",
            error: error.message,
        });
    }
}

export default {
    bookAppointment,
    cancelAppointment,
    listMyAppointments,
};
