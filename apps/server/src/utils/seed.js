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

// Seed function
const seed = async () => {
    console.log("Starting large-scale seeding...");

    try {
        await Sequelize.sync({ force: true });
        console.log("🔄 Schema synced.");

        // === Specializations ===
        const specializations = await Specialization.bulkCreate(
            SPECIALIZATION_NAMES.map((name) => ({
                name,
                description: `${name} related medical care`,
            })),
        );
        console.log(`${specializations.length} specializations created.`);

        // === Hospitals ===
        const hospitals = await Hospital.bulkCreate(
            HOSPITAL_NAMES.map((name, idx) => ({
                name,
                address: `${100 + idx} Main Street, City ${idx + 1}`,
                contact_info: {
                    phone: `555-${1000 + idx}`,
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
                qualifications: `MD #${i}`,
                specializationId:
                    specializations[rand(0, specializations.length)].id,
                hospitalId: hospitals[rand(0, hospitals.length)].id,
            });
            doctors.push(doctor);
        }
        console.log(`${doctors.length} doctors created.`);

        // === Doctor Schedules ===
        const scheduleDays = [1, 2, 3, 4, 5]; // Monday - Friday
        for (const doc of doctors) {
            for (const day of scheduleDays) {
                await DoctorSchedule.create({
                    doctorId: doc.id,
                    day_of_week: day,
                    start_time: "09:00:00",
                    end_time: "12:00:00",
                    slot_duration_minutes: 15,
                });
            }
        }
        console.log(`Doctor schedules created for ${doctors.length} doctors.`);

        // === Appointments ===
        for (let i = 0; i < 200; i++) {
            const user = users[rand(0, users.length)];
            const doctor = doctors[rand(0, doctors.length)];

            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + rand(1, 30)); // within next 30 days
            appointmentDate.setHours(rand(9, 12), 0, 0, 0); // 9 AM - 12 PM

            await Appointment.create({
                userId: user.id,
                doctorId: doctor.id,
                appointment_time: appointmentDate,
                status: "SCHEDULED",
                notes: `Auto-generated appointment ${i}`,
            });
        }
        console.log("200 appointments created.");

        // === Files ===
        const files = [];
        for (let i = 0; i < 10; i++) {
            const file = await File.create({
                name: `file${i}.pdf`,
            });
            files.push(file);
        }
        console.log(`${files.length} files created.`);

        // === Prescriptions ===
        const prescriptions = [];
        for (let i = 0; i < 100; i++) {
            const doctor = doctors[rand(0, doctors.length)];
            const prescription = await Prescription.create({
                doctorName: doctor.name,
                clinicName: "City Central Hospital",
                dateIssued: new Date(),
                notes: `Prescription notes ${i}`,
            });
            prescriptions.push(prescription);
        }
        console.log(`${prescriptions.length} prescriptions created.`);

        // === Medications ===
        const medications = [];
        for (let i = 0; i < 50; i++) {
            const prescription =
                prescriptions[rand(0, prescriptions.length)];
            const medication = await Medication.create({
                name: MEDICATION_NAMES[rand(0, MEDICATION_NAMES.length)],
                dosage: `${rand(1, 5)}mg`,
                instructions: "Take with food",
                prescriptionId: prescription.id,
            });
            medications.push(medication);
        }
        console.log(`${medications.length} medications created.`);

        // === Medication Schedules ===
        const frequencies = [
            "Daily",
            "Twice a day",
            "On alternate days",
            "Weekly",
            "As needed",
        ];
        for (const med of medications) {
            await MedicationSchedule.create({
                medicationId: med.id,
                frequency: frequencies[rand(0, frequencies.length)],
            });
        }
        console.log(
            `Medication schedules created for ${medications.length} medications.`,
        );

        // === User-Doctor Relationships ===
        for (let i = 0; i < 100; i++) {
            const user = users[rand(0, users.length)];
            const doctor = doctors[rand(0, doctors.length)];
            await UserDoctor.create({
                userId: user.id,
                doctorId: doctor.id,
            });
        }
        console.log("100 User-Doctor relationships created.");

        // === Doctor-Hospital Relationships ===
        for (let i = 0; i < 100; i++) {
            const doctor = doctors[rand(0, doctors.length)];
            const hospital = hospitals[rand(0, hospitals.length)];
            await DoctorHospital.create({
                doctorId: doctor.id,
                hospitalId: hospital.id,
            });
        }
        console.log("100 Doctor-Hospital relationships created.");

        console.log("Large-scale seeding complete.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        await Sequelize.close();
        console.log("Connection closed.");
    }
};

export default seed;
