import { Sequelize } from "#utils";
import {
    User,
    Doctor,
    Hospital,
    Specialization,
    DoctorSchedule,
    Appointment,
    File,
    Medication,
    MedicationSchedule,
    Prescription,
    UserDoctor,
    DoctorHospital,
} from "#models";

const SPECIALIZATION_NAMES = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Oncology",
    "Gastroenterology",
    "Urology",
];

const HOSPITAL_NAMES = [
    "General Hospital",
    "City Central Hospital",
    "Metro Health Center",
    "Sunrise Clinic",
    "Lakeside Medical",
    "Heritage Hospital",
    "Silverline Care",
    "Northside Clinic",
    "Harmony Health",
    "Trinity Hospital",
];

const MEDICATION_NAMES = [
    "Lisinopril",
    "Atorvastatin",
    "Metformin",
    "Amlodipine",
    "Metoprolol",
    "Albuterol",
    "Omeprazole",
    "Losartan",
    "Gabapentin",
    "Hydrochlorothiazide",
];

// Helper: Generate random number in [min, max)
const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Helper: Generate random time
const randomTime = () => {
    const hour = rand(8, 17);
    return `${hour.toString().padStart(2, "0")}:00:00`;
};

// Helper: Generate unique pairs to avoid duplicate relationships
const generateUniquePairs = (array1, array2, count) => {
    // Validate input arrays
    if (!array1 || !array2 || array1.length === 0 || array2.length === 0) {
        console.warn("Warning: Invalid arrays passed to generateUniquePairs");
        return [];
    }

    // Validate that all items have valid IDs
    const validArray1 = array1.filter(
        (item) => item && item.id !== undefined && item.id !== null,
    );
    const validArray2 = array2.filter(
        (item) => item && item.id !== undefined && item.id !== null,
    );

    if (validArray1.length === 0 || validArray2.length === 0) {
        console.warn("Warning: No valid items with IDs found in arrays");
        return [];
    }

    const pairs = new Set();
    const maxPossible = validArray1.length * validArray2.length;
    const targetCount = Math.min(count, maxPossible);
    const maxAttempts = targetCount * 10; // Prevent infinite loops
    let attempts = 0;

    while (pairs.size < targetCount && attempts < maxAttempts) {
        const item1 = validArray1[rand(0, validArray1.length)];
        const item2 = validArray2[rand(0, validArray2.length)];

        // Create pair key using string representation of IDs (works for both UUIDs and integers)
        if (item1 && item2 && item1.id && item2.id) {
            const pairKey = `${String(item1.id)}-${String(item2.id)}`;
            pairs.add(pairKey);
        }
        attempts++;
    }

    const result = [];
    for (const pairKey of pairs) {
        const lastDashIndex = pairKey.lastIndexOf("-");
        if (lastDashIndex === -1) {
            console.warn(`Warning: Invalid pair key format: ${pairKey}`);
            continue;
        }

        const id1Str = pairKey.substring(0, lastDashIndex);
        const id2Str = pairKey.substring(lastDashIndex + 1);

        // Find items by string comparison (works for both UUIDs and integers)
        const item1 = validArray1.find((item) => String(item.id) === id1Str);
        const item2 = validArray2.find((item) => String(item.id) === id2Str);

        if (item1 && item2) {
            result.push({
                item1,
                item2,
            });
        } else {
            console.warn(
                `Warning: Could not find items for IDs ${id1Str}-${id2Str}`,
            );
        }
    }

    return result;
};

// Helper: Check for appointment conflicts
const hasAppointmentConflict = (
    existingAppointments,
    doctorId,
    appointmentTime,
) => {
    return existingAppointments.some(
        (apt) =>
            apt.doctorId === doctorId &&
            Math.abs(new Date(apt.appointment_time) - appointmentTime) <
                15 * 60 * 1000, // 15 minutes
    );
};

// Seed function
const seed = async () => {
    console.log("Starting large-scale seeding...");

    try {
        await Sequelize.sync({ force: true });
        console.log("Schema synced.");

        // === Specializations ===
        const specializations = await Specialization.bulkCreate(
            SPECIALIZATION_NAMES.map((name) => ({
                name,
                description: `${name} related medical care`, // Fixed typo: "rellated" -> "related"
            })),
        );
        console.log(`${specializations.length} specializations created.`);

        // === Hospitals ===
        const hospitals = await Hospital.bulkCreate(
            HOSPITAL_NAMES.map((name, idx) => ({
                name,
                address: `${100 + idx} Main Street, City ${idx + 1}`,
                contact_info: {
                    phone: `555-${(1000 + idx).toString().padStart(4, "0")}`, // Ensure 4-digit format
                    email: `info${idx}@hospital.com`,
                },
            })),
        );
        console.log(`${hospitals.length} hospitals created.`);

        // === Users ===
        const users = [];
        for (let i = 0; i < 50; i++) {
            const user = await User.create({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: `password${i}`,
            });
            users.push(user);
        }
        console.log(`${users.length} users created.`);

        // === Doctors ===
        const doctors = [];
        for (let i = 0; i < 100; i++) {
            const doctor = await Doctor.create({
                name: `Dr. Doctor${i}`,
                qualifications: `MD, License #${i.toString().padStart(4, "0")}`, // More realistic format
                specializationId:
                    specializations[rand(0, specializations.length)].id,
                // Remove hospitalId from doctor creation - handle via DoctorHospital relationship
            });
            doctors.push(doctor);
        }
        console.log(`${doctors.length} doctors created.`);

        // === Doctor Schedules ===
        const scheduleDays = [1, 2, 3, 4, 5]; // Monday - Friday
        const scheduleCreationPromises = [];

        for (const doc of doctors) {
            for (const day of scheduleDays) {
                scheduleCreationPromises.push(
                    DoctorSchedule.create({
                        doctorId: doc.id,
                        day_of_week: day,
                        start_time: "09:00:00",
                        end_time: "17:00:00", // Extended hours for more realistic scheduling
                        slot_duration_minutes: 30, // More realistic slot duration
                    }),
                );
            }
        }

        await Promise.all(scheduleCreationPromises);
        console.log(`Doctor schedules created for ${doctors.length} doctors.`);

        // === Doctor-Hospital Relationships (Create before appointments) ===
        // Ensure each doctor has at least one hospital, then add additional relationships
        const doctorHospitalPairs = [];

        // First, assign each doctor to one random hospital
        for (const doctor of doctors) {
            const hospital = hospitals[rand(0, hospitals.length)];
            doctorHospitalPairs.push({ item1: doctor, item2: hospital });
        }

        // Then add additional random relationships (avoiding duplicates)
        const additionalPairs = generateUniquePairs(doctors, hospitals, 50);
        const existingPairKeys = new Set(
            doctorHospitalPairs.map((p) => `${p.item1.id}-${p.item2.id}`),
        );

        for (const pair of additionalPairs) {
            const pairKey = `${pair.item1.id}-${pair.item2.id}`;
            if (!existingPairKeys.has(pairKey)) {
                doctorHospitalPairs.push(pair);
                existingPairKeys.add(pairKey);
            }
        }

        const doctorHospitalPromises = doctorHospitalPairs.map(
            ({ item1: doctor, item2: hospital }) =>
                DoctorHospital.create({
                    doctorId: doctor.id,
                    hospitalId: hospital.id,
                }),
        );

        await Promise.all(doctorHospitalPromises);
        console.log(
            `${doctorHospitalPairs.length} Doctor-Hospital relationships created.`,
        );

        // === Appointments ===
        const appointments = [];
        const appointmentPromises = [];

        for (let i = 0; i < 200; i++) {
            const user = users[rand(0, users.length)];
            const doctor = doctors[rand(0, doctors.length)];

            // Generate appointment time ensuring it's within doctor's schedule
            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + rand(1, 30)); // within next 30 days

            // Ensure appointment is on a weekday (Monday-Friday)
            const dayOfWeek = appointmentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Sunday or Saturday
                appointmentDate.setDate(
                    appointmentDate.getDate() + (dayOfWeek === 0 ? 1 : 2),
                );
            }

            // Set time within working hours (9 AM - 5 PM) with 30-minute slots
            const hour = rand(9, 17);
            const minute = rand(0, 2) * 30; // 0 or 30 minutes
            appointmentDate.setHours(hour, minute, 0, 0);

            // Check for conflicts before creating
            if (
                !hasAppointmentConflict(
                    appointments,
                    doctor.id,
                    appointmentDate,
                )
            ) {
                const appointmentData = {
                    userId: user.id,
                    doctorId: doctor.id,
                    appointment_time: appointmentDate,
                    status: ["SCHEDULED", "CANCELLED", "COMPLETED"][rand(0, 3)], // Fixed enum values
                    notes: `Auto-generated appointment ${i}`,
                };

                appointments.push(appointmentData);
                appointmentPromises.push(Appointment.create(appointmentData));
            }
        }

        await Promise.all(appointmentPromises);
        console.log(`${appointments.length} appointments created.`);

        // === Files ===
        const files = [];
        for (let i = 0; i < 10; i++) {
            const file = await File.create({
                name: `medical_record_${i}.pdf`,
                // Add any other required fields for File model
            });
            files.push(file);
        }
        console.log(`${files.length} files created.`);

        // === Prescriptions ===
        const prescriptions = [];
        for (let i = 0; i < 100; i++) {
            const doctor = doctors[rand(0, doctors.length)];

            // Get a hospital where this doctor works
            const doctorHospitalRelation = doctorHospitalPairs.find(
                (pair) => pair.item1.id === doctor.id,
            );
            const clinicName = doctorHospitalRelation
                ? doctorHospitalRelation.item2.name
                : "General Clinic";

            const prescription = await Prescription.create({
                doctorName: doctor.name,
                clinicName: clinicName,
                dateIssued: new Date(
                    Date.now() - rand(0, 365) * 24 * 60 * 60 * 1000,
                ), // Random date within last year
                notes: `Prescription notes ${i} - Follow up in ${rand(1, 4)} weeks`,
            });
            prescriptions.push(prescription);
        }
        console.log(`${prescriptions.length} prescriptions created.`);

        // === Medications ===
        const medications = [];
        const medicationPromises = [];

        for (let i = 0; i < 50; i++) {
            const prescription = prescriptions[rand(0, prescriptions.length)];
            const medicationData = {
                name: MEDICATION_NAMES[rand(0, MEDICATION_NAMES.length)],
                dosage: `${rand(5, 50) * 5}mg`, // More realistic dosages (5mg, 10mg, 15mg, etc.)
                instructions: [
                    "Take with food",
                    "Take on empty stomach",
                    "Take before bedtime",
                    "Take in the morning",
                    "Take as needed for pain",
                ][rand(0, 5)],
                prescriptionId: prescription.id,
            };

            medications.push(medicationData);
            medicationPromises.push(Medication.create(medicationData));
        }

        const createdMedications = await Promise.all(medicationPromises);
        console.log(`${createdMedications.length} medications created.`);

        // === Medication Schedules ===
        const frequencies = [
            "Once daily",
            "Twice daily",
            "Three times daily",
            "Every other day",
            "Weekly",
            "As needed",
        ];

        const schedulePromises = createdMedications.map((med) =>
            MedicationSchedule.create({
                medicationId: med.id,
                frequency: frequencies[rand(0, frequencies.length)],
                startDate: new Date(),
                endDate: new Date(
                    Date.now() + rand(7, 90) * 24 * 60 * 60 * 1000,
                ), // 1 week to 3 months
            }),
        );

        await Promise.all(schedulePromises);
        console.log(
            `Medication schedules created for ${createdMedications.length} medications.`,
        );

        // === User-Doctor Relationships ===
        // Ensure reasonable number of relationships without exceeding possibilities
        const maxUserDoctorRelations = Math.min(
            100,
            users.length * 3,
            users.length * doctors.length,
        );
        const userDoctorPairs = generateUniquePairs(
            users,
            doctors,
            maxUserDoctorRelations,
        );

        const userDoctorPromises = userDoctorPairs.map(
            ({ item1: user, item2: doctor }) =>
                UserDoctor.create({
                    userId: user.id,
                    doctorId: doctor.id,
                    relationshipDate: new Date(
                        Date.now() - rand(0, 365) * 24 * 60 * 60 * 1000,
                    ), // Random date within last year
                }),
        );

        await Promise.all(userDoctorPromises);
        console.log(
            `${userDoctorPairs.length} User-Doctor relationships created.`,
        );

        console.log("Large-scale seeding completed successfully!");

        // Print summary
        console.log("\nSEEDING SUMMARY:");
        console.log(`   Specializations: ${specializations.length}`);
        console.log(`   Hospitals: ${hospitals.length}`);
        console.log(`   Users: ${users.length}`);
        console.log(`   Doctors: ${doctors.length}`);
        console.log(`   Appointments: ${appointments.length}`);
        console.log(`   Prescriptions: ${prescriptions.length}`);
        console.log(`   Medications: ${createdMedications.length}`);
        console.log(`   User-Doctor Relations: ${userDoctorPairs.length}`);
        console.log(
            `   Doctor-Hospital Relations: ${doctorHospitalPairs.length}`,
        );
    } catch (err) {
        console.error("Seeding failed:", err);
        throw err; // Re-throw to handle upstream
    } finally {
        console.log("Seeding process completed.");
    }
};

export default seed;
