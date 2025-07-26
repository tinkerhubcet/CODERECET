import { Sequelize } from "#utils";
import { Op } from "sequelize";
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

// Realistic data arrays
const SPECIALIZATIONS = [
    {
        name: "Cardiology",
        description:
            "Diagnosis and treatment of heart and cardiovascular diseases",
    },
    {
        name: "Dermatology",
        description:
            "Medical and surgical treatment of skin, hair, and nail conditions",
    },
    {
        name: "Neurology",
        description: "Treatment of disorders of the nervous system and brain",
    },
    {
        name: "Orthopedics",
        description:
            "Musculoskeletal system treatment including bones, joints, and muscles",
    },
    {
        name: "Pediatrics",
        description: "Medical care for infants, children, and adolescents",
    },
    {
        name: "Psychiatry",
        description: "Mental health and emotional disorders treatment",
    },
    {
        name: "Radiology",
        description: "Medical imaging and diagnostic procedures",
    },
    {
        name: "Oncology",
        description: "Cancer diagnosis, treatment, and research",
    },
    {
        name: "Gastroenterology",
        description: "Digestive system and liver disorders treatment",
    },
    {
        name: "Urology",
        description: "Urinary tract and male reproductive system treatment",
    },
    {
        name: "Endocrinology",
        description: "Hormone and metabolic disorders treatment",
    },
    {
        name: "Pulmonology",
        description: "Respiratory system and lung disorders treatment",
    },
];

const HOSPITALS = [
    {
        name: "Central Medical Center",
        address: "1200 Health Boulevard, Medical District",
        phone: "555-0100",
        email: "info@centralmedical.com",
    },
    {
        name: "St. Mary's General Hospital",
        address: "850 Mercy Street, Downtown",
        phone: "555-0150",
        email: "contact@stmarys.org",
    },
    {
        name: "University Medical Center",
        address: "2500 Academic Way, University Campus",
        phone: "555-0200",
        email: "info@umc.edu",
    },
    {
        name: "Regional Heart Institute",
        address: "400 Cardiac Drive, Specialist Row",
        phone: "555-0250",
        email: "heart@regional.com",
    },
    {
        name: "Children's Healthcare Center",
        address: "1800 Pediatric Plaza, Family District",
        phone: "555-0300",
        email: "care@childrens.org",
    },
    {
        name: "Metro Surgical Hospital",
        address: "3000 Surgery Circle, Medical Mile",
        phone: "555-0350",
        email: "surgical@metro.com",
    },
    {
        name: "Riverside Community Hospital",
        address: "500 River Road, Westside",
        phone: "555-0400",
        email: "community@riverside.org",
    },
    {
        name: "Advanced Cancer Center",
        address: "1500 Oncology Avenue, Research Park",
        phone: "555-0450",
        email: "oncology@advanced.com",
    },
];

const MEDICATIONS = [
    {
        name: "Lisinopril",
        commonDosages: ["5mg", "10mg", "20mg"],
        category: "ACE Inhibitor",
    },
    {
        name: "Atorvastatin",
        commonDosages: ["10mg", "20mg", "40mg", "80mg"],
        category: "Statin",
    },
    {
        name: "Metformin",
        commonDosages: ["500mg", "850mg", "1000mg"],
        category: "Diabetes",
    },
    {
        name: "Amlodipine",
        commonDosages: ["2.5mg", "5mg", "10mg"],
        category: "Calcium Channel Blocker",
    },
    {
        name: "Metoprolol",
        commonDosages: ["25mg", "50mg", "100mg"],
        category: "Beta Blocker",
    },
    {
        name: "Albuterol",
        commonDosages: ["90mcg", "108mcg"],
        category: "Bronchodilator",
    },
    {
        name: "Omeprazole",
        commonDosages: ["20mg", "40mg"],
        category: "Proton Pump Inhibitor",
    },
    {
        name: "Losartan",
        commonDosages: ["25mg", "50mg", "100mg"],
        category: "ARB",
    },
    {
        name: "Gabapentin",
        commonDosages: ["100mg", "300mg", "400mg", "600mg"],
        category: "Anticonvulsant",
    },
    {
        name: "Hydrochlorothiazide",
        commonDosages: ["12.5mg", "25mg", "50mg"],
        category: "Diuretic",
    },
    {
        name: "Sertraline",
        commonDosages: ["25mg", "50mg", "100mg"],
        category: "SSRI",
    },
    {
        name: "Levothyroxine",
        commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg"],
        category: "Thyroid",
    },
];

const FIRST_NAMES = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Elizabeth",
    "David",
    "Barbara",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Charles",
    "Karen",
    "Christopher",
    "Nancy",
    "Daniel",
    "Lisa",
    "Matthew",
    "Betty",
    "Anthony",
    "Helen",
    "Mark",
    "Sandra",
    "Donald",
    "Donna",
    "Steven",
    "Carol",
    "Paul",
    "Ruth",
    "Andrew",
    "Sharon",
    "Joshua",
    "Michelle",
    "Kenneth",
    "Laura",
    "Kevin",
    "Sarah",
    "Brian",
    "Kimberly",
    "George",
    "Deborah",
    "Edward",
    "Dorothy",
    "Ronald",
    "Lisa",
    "Timothy",
    "Nancy",
    "Jason",
    "Karen",
];

const LAST_NAMES = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
];

const MEDICAL_DEGREES = ["MD", "DO", "MBBS"];
const MEDICAL_SPECIALTIES_CERTS = [
    "Board Certified",
    "Fellowship Trained",
    "Residency Completed",
];

// Helper functions
const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const choice = (array) => array[rand(0, array.length)];
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const generateName = () => `${choice(FIRST_NAMES)} ${choice(LAST_NAMES)}`;

const generateEmail = (name) => {
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
    const domain = choice([
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "email.com",
    ]);
    return `${cleanName}${rand(1, 999)}@${domain}`;
};

const generateUsername = (name) => {
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
    return `${cleanName}${rand(10, 9999)}`;
};

const generateDoctorQualifications = (specialization) => {
    const degree = choice(MEDICAL_DEGREES);
    const cert = choice(MEDICAL_SPECIALTIES_CERTS);
    const licenseNum = rand(10000, 99999);
    return `${degree}, ${cert} in ${specialization}, License #${licenseNum}`;
};

const generateAppointmentTime = (daysFromNow = 30) => {
    const date = new Date();
    date.setDate(date.getDate() + rand(-30, daysFromNow)); // Past 30 days to future 30 days

    // Ensure weekday (Monday-Friday)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) date.setDate(date.getDate() + 1); // Sunday -> Monday
    if (dayOfWeek === 6) date.setDate(date.getDate() + 2); // Saturday -> Monday

    // Set working hours (8 AM - 6 PM) in 15-minute slots
    const hour = rand(8, 18);
    const minute = choice([0, 15, 30, 45]);
    date.setHours(hour, minute, 0, 0);

    return date;
};

const generateUniquePairs = (array1, array2, maxCount) => {
    if (!array1?.length || !array2?.length) return [];

    const pairs = new Set();
    const maxPossible = array1.length * array2.length;
    const targetCount = Math.min(maxCount, maxPossible);
    let attempts = 0;

    while (pairs.size < targetCount && attempts < targetCount * 5) {
        const item1 = choice(array1);
        const item2 = choice(array2);
        pairs.add(`${item1.id}-${item2.id}`);
        attempts++;
    }

    return Array.from(pairs)
        .map((pairKey) => {
            const [id1, id2] = pairKey.split("-");
            return {
                item1: array1.find((item) => String(item.id) === id1),
                item2: array2.find((item) => String(item.id) === id2),
            };
        })
        .filter((pair) => pair.item1 && pair.item2);
};

const hasAppointmentConflict = (appointments, doctorId, appointmentTime) => {
    return appointments.some(
        (apt) =>
            apt.doctorId === doctorId &&
            Math.abs(new Date(apt.appointment_time) - appointmentTime) <
                30 * 60 * 1000, // 30 minutes
    );
};

// Production safety check
const checkProductionSafety = async () => {
    try {
        // Check if any tables have data
        const [userCount, doctorCount, hospitalCount, specializationCount] =
            await Promise.all([
                User.count().catch(() => 0),
                Doctor.count().catch(() => 0),
                Hospital.count().catch(() => 0),
                Specialization.count().catch(() => 0),
            ]);

        if (
            userCount > 0 ||
            doctorCount > 0 ||
            hospitalCount > 0 ||
            specializationCount > 0
        ) {
            console.log(
                "🚫 Database already contains data. Seeding aborted for safety.",
            );
            console.log(
                `Current counts - Users: ${userCount}, Doctors: ${doctorCount}, Hospitals: ${hospitalCount}, Specializations: ${specializationCount}`,
            );
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking database state:", error);
        // If we can't check, assume it's unsafe
        return false;
    }
};

// Main seed function
const seed = async (options = {}) => {
    const {
        force = false,
        skipExisting = true, // New option to skip seeding if data exists
        userCount = 100,
        doctorCount = 150,
        appointmentCount = 500,
        prescriptionCount = 200,
    } = options;

    console.log("🌱 Starting enhanced database seeding...");

    try {
        // Production safety check BEFORE syncing database
        if (!force && skipExisting) {
            const isSafe = await checkProductionSafety();
            if (!isSafe) {
                return {
                    success: false,
                    message: "Seeding aborted - database already contains data",
                };
            }
        }

        // Sync database
        await Sequelize.sync({ force: force });
        console.log("✅ Database schema synchronized");

        // Double-check after sync if not forcing
        if (!force && skipExisting) {
            const isSafe = await checkProductionSafety();
            if (!isSafe) {
                return {
                    success: false,
                    message:
                        "Seeding aborted - database contains data after sync",
                };
            }
        }

        // === Specializations ===
        // Use findOrCreate to handle existing specializations
        const specializationPromises = SPECIALIZATIONS.map((spec) =>
            Specialization.findOrCreate({
                where: { name: spec.name },
                defaults: spec,
            }),
        );
        const specializationResults = await Promise.all(specializationPromises);
        const specializations = specializationResults.map(
            ([instance, created]) => instance,
        );
        console.log(
            `✅ Specializations: ${specializations.length} total (${specializationResults.filter(([, created]) => created).length} new)`,
        );

        // === Hospitals ===
        // Use findOrCreate to handle existing hospitals
        const hospitalData = HOSPITALS.map((hospital) => ({
            name: hospital.name,
            address: hospital.address,
            contact_info: {
                phone: hospital.phone,
                email: hospital.email,
                website: `https://www.${hospital.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
                fax: hospital.phone.replace("555-", "555-9"),
            },
        }));

        const hospitalPromises = hospitalData.map((hospital) =>
            Hospital.findOrCreate({
                where: { name: hospital.name },
                defaults: hospital,
            }),
        );
        const hospitalResults = await Promise.all(hospitalPromises);
        const hospitals = hospitalResults.map(
            ([instance, created]) => instance,
        );
        console.log(
            `✅ Hospitals: ${hospitals.length} total (${hospitalResults.filter(([, created]) => created).length} new)`,
        );

        // === Users ===
        console.log(`🔄 Creating ${userCount} users...`);
        const users = [];
        const batchSize = 50; // Process users in batches

        for (let i = 0; i < userCount; i += batchSize) {
            const batchPromises = [];
            const batchEnd = Math.min(i + batchSize, userCount);

            for (let j = i; j < batchEnd; j++) {
                const name = generateName();
                const username = generateUsername(name);
                const email = generateEmail(name);

                batchPromises.push(
                    User.findOrCreate({
                        where: {
                            [Op.or]: [{ username: username }, { email: email }],
                        },
                        defaults: {
                            username: username,
                            email: email,
                            password: `SecurePass${rand(100, 999)}!`,
                        },
                    }).catch((error) => {
                        // If unique constraint fails, try with modified username/email
                        const altUsername = `${username}_${rand(100, 999)}`;
                        const altEmail = `${email.split("@")[0]}_${rand(100, 999)}@${email.split("@")[1]}`;

                        return User.findOrCreate({
                            where: {
                                [Op.or]: [
                                    { username: altUsername },
                                    { email: altEmail },
                                ],
                            },
                            defaults: {
                                username: altUsername,
                                email: altEmail,
                                password: `SecurePass${rand(100, 999)}!`,
                            },
                        });
                    }),
                );
            }

            const batchResults = await Promise.all(batchPromises);
            const batchUsers = batchResults.map(
                ([instance, created]) => instance,
            );
            users.push(...batchUsers);

            console.log(`   📊 Created ${users.length}/${userCount} users`);
        }
        console.log(`✅ Users: ${users.length} total`);

        // === Doctors ===
        console.log(`🔄 Creating ${doctorCount} doctors...`);
        const doctors = [];
        for (let i = 0; i < doctorCount; i++) {
            const name = generateName();
            const specialization = choice(specializations);

            const doctor = await Doctor.create({
                name: `Dr. ${name}`,
                qualifications: generateDoctorQualifications(
                    specialization.name,
                ),
                specializationId: specialization.id,
            });
            doctors.push(doctor);

            if (i % 30 === 0)
                console.log(`   📊 Created ${i + 1}/${doctorCount} doctors`);
        }
        console.log(`✅ Created ${doctors.length} doctors`);

        // === Doctor Schedules ===
        console.log("🔄 Creating doctor schedules...");
        let schedulePromises = [];
        const workDays = [1, 2, 3, 4, 5]; // Monday to Friday
        const scheduleVariations = [
            { start: "08:00:00", end: "16:00:00", slot: 30 },
            { start: "09:00:00", end: "17:00:00", slot: 30 },
            { start: "10:00:00", end: "18:00:00", slot: 30 },
            { start: "07:00:00", end: "15:00:00", slot: 30 },
            { start: "13:00:00", end: "21:00:00", slot: 30 }, // Evening shift
        ];

        for (const doctor of doctors) {
            const schedule = choice(scheduleVariations);
            const doctorWorkDays = rand(3, 6); // Doctor works 3-5 days
            const selectedDays = shuffle(workDays).slice(0, doctorWorkDays);

            for (const day of selectedDays) {
                schedulePromises.push(
                    DoctorSchedule.create({
                        doctorId: doctor.id,
                        day_of_week: day,
                        start_time: schedule.start,
                        end_time: schedule.end,
                        slot_duration_minutes: schedule.slot,
                    }),
                );
            }
        }

        await Promise.all(schedulePromises);
        console.log(`✅ Created schedules for ${doctors.length} doctors`);

        // === Doctor-Hospital Relationships ===
        console.log("🔄 Creating doctor-hospital relationships...");
        const doctorHospitalPairs = [];

        // Each doctor works at 1-3 hospitals
        for (const doctor of doctors) {
            const hospitalCount = rand(1, 4);
            const selectedHospitals = shuffle(hospitals).slice(
                0,
                hospitalCount,
            );

            for (const hospital of selectedHospitals) {
                doctorHospitalPairs.push({ item1: doctor, item2: hospital });
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
            `✅ Created ${doctorHospitalPairs.length} doctor-hospital relationships`,
        );

        // === Appointments ===
        console.log(`🔄 Creating ${appointmentCount} appointments...`);
        const appointments = [];
        const appointmentPromises = [];
        const statuses = ["SCHEDULED", "COMPLETED", "CANCELLED"];
        const statusWeights = [0.6, 0.3, 0.1]; // 60% scheduled, 30% completed, 10% cancelled

        for (let i = 0; i < appointmentCount; i++) {
            const user = choice(users);
            const doctor = choice(doctors);
            const appointmentTime = generateAppointmentTime();

            // Skip if conflict exists
            if (
                hasAppointmentConflict(appointments, doctor.id, appointmentTime)
            ) {
                continue;
            }

            // Weight status selection
            let status = "SCHEDULED";
            const random = Math.random();
            if (random < statusWeights[2]) status = "CANCELLED";
            else if (random < statusWeights[2] + statusWeights[1])
                status = "COMPLETED";

            const appointmentData = {
                userId: user.id,
                doctorId: doctor.id,
                appointment_time: appointmentTime,
                status: status,
                notes:
                    status === "COMPLETED"
                        ? choice([
                              "Regular checkup completed successfully",
                              "Follow-up scheduled for next month",
                              "Prescribed medication, patient responded well",
                              "Recommended lifestyle changes discussed",
                          ])
                        : status === "CANCELLED"
                          ? choice([
                                "Patient requested reschedule",
                                "Emergency cancellation",
                                "Insurance verification needed",
                            ])
                          : choice([
                                "Regular consultation appointment",
                                "Follow-up visit",
                                "Initial consultation",
                                "Annual checkup",
                            ]),
            };

            appointments.push(appointmentData);
            appointmentPromises.push(Appointment.create(appointmentData));

            if (i % 50 === 0)
                console.log(
                    `   📊 Created ${i + 1}/${appointmentCount} appointments`,
                );
        }

        await Promise.all(appointmentPromises);
        console.log(`✅ Created ${appointments.length} appointments`);

        // === Files (Medical Records) ===
        const fileTypes = [
            { ext: "pdf", type: "Lab Results" },
            { ext: "pdf", type: "X-Ray Report" },
            { ext: "pdf", type: "MRI Scan" },
            { ext: "pdf", type: "Prescription" },
            { ext: "jpg", type: "Medical Image" },
            { ext: "pdf", type: "Discharge Summary" },
        ];

        const files = [];
        for (let i = 0; i < 50; i++) {
            const fileType = choice(fileTypes);
            const user = choice(users);

            const file = await File.create({
                name: `${fileType.type.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}_${i}.${fileType.ext}`,
                url: `https://medical-records.s3.amazonaws.com/files/${user.id}/${Date.now()}_${i}.${fileType.ext}`,
                key: `files/${user.id}/${Date.now()}_${i}.${fileType.ext}`,
                bucket: "medical-records",
                userId: user.id,
            });
            files.push(file);
        }
        console.log(`✅ Created ${files.length} medical record files`);

        // === Prescriptions ===
        console.log(`🔄 Creating ${prescriptionCount} prescriptions...`);
        const prescriptions = [];
        for (let i = 0; i < prescriptionCount; i++) {
            const user = choice(users);
            const doctor = choice(doctors);
            const hospital = choice(
                doctorHospitalPairs.filter(
                    (pair) => pair.item1.id === doctor.id,
                ),
            ).item2;

            const daysAgo = rand(1, 365);
            const issueDate = new Date();
            issueDate.setDate(issueDate.getDate() - daysAgo);

            const prescription = await Prescription.create({
                userId: user.id,
                doctorName: doctor.name,
                clinicName: hospital ? hospital.name : "General Medical Clinic",
                dateIssued: issueDate,
                notes: choice([
                    "Take medications as prescribed. Follow up in 2 weeks.",
                    "Monitor blood pressure daily. Return if symptoms worsen.",
                    "Complete full course of antibiotics. Rest and hydration recommended.",
                    "Take with food to avoid stomach upset. Schedule follow-up in 1 month.",
                    "Avoid alcohol while taking medication. Monitor for side effects.",
                ]),
            });
            prescriptions.push(prescription);

            if (i % 25 === 0)
                console.log(
                    `   📊 Created ${i + 1}/${prescriptionCount} prescriptions`,
                );
        }
        console.log(`✅ Created ${prescriptions.length} prescriptions`);

        // === Medications ===
        console.log("🔄 Creating medications...");
        const medications = [];
        for (const prescription of prescriptions) {
            const medicationCount = rand(1, 4); // 1-3 medications per prescription

            for (let i = 0; i < medicationCount; i++) {
                const med = choice(MEDICATIONS);
                const dosage = choice(med.commonDosages);

                const instructions = choice([
                    "Take with food",
                    "Take on empty stomach",
                    "Take before bedtime",
                    "Take in the morning",
                    "Take with plenty of water",
                    "Take as needed for pain",
                    "Take at the same time each day",
                    "Avoid dairy products 2 hours before/after",
                ]);

                const medication = await Medication.create({
                    name: med.name,
                    dosage: dosage,
                    instructions: instructions,
                    prescriptionId: prescription.id,
                });
                medications.push(medication);
            }
        }
        console.log(`✅ Created ${medications.length} medications`);

        // === Medication Schedules ===
        console.log("🔄 Creating medication schedules...");
        schedulePromises = medications.map((med) => {
            const frequencies = [
                "Once daily",
                "Twice daily",
                "Three times daily",
                "Every other day",
                "Weekly",
                "As needed",
            ];
            const frequency = choice(frequencies);

            return MedicationSchedule.create({
                medicationId: med.id,
                frequency: frequency,
            });
        });

        await Promise.all(schedulePromises);
        console.log(
            `✅ Created medication schedules for ${medications.length} medications`,
        );

        // === User-Doctor Relationships ===
        console.log("🔄 Creating user-doctor relationships...");
        const userDoctorPairs = [];

        // Each user has 1-5 doctors
        for (const user of users) {
            const doctorCount = rand(1, 6);
            const selectedDoctors = shuffle(doctors).slice(0, doctorCount);

            for (const doctor of selectedDoctors) {
                const relationshipDate = new Date();
                relationshipDate.setDate(
                    relationshipDate.getDate() - rand(1, 730),
                ); // Within last 2 years

                userDoctorPairs.push({
                    userId: user.id,
                    doctorId: doctor.id,
                    relationshipDate: relationshipDate,
                });
            }
        }

        const userDoctorPromises = userDoctorPairs.map((pair) =>
            UserDoctor.create(pair),
        );
        await Promise.all(userDoctorPromises);
        console.log(
            `✅ Created ${userDoctorPairs.length} user-doctor relationships`,
        );

        // === Summary ===
        console.log("\n🎉 SEEDING COMPLETED SUCCESSFULLY!");
        console.log("=".repeat(50));
        console.log(`📊 SUMMARY:`);
        console.log(`   🏥 Specializations: ${specializations.length}`);
        console.log(`   🏥 Hospitals: ${hospitals.length}`);
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   👨‍⚕️ Doctors: ${doctors.length}`);
        console.log(`   📅 Appointments: ${appointments.length}`);
        console.log(`   📋 Prescriptions: ${prescriptions.length}`);
        console.log(`   💊 Medications: ${medications.length}`);
        console.log(`   🔗 User-Doctor Relations: ${userDoctorPairs.length}`);
        console.log(
            `   🔗 Doctor-Hospital Relations: ${doctorHospitalPairs.length}`,
        );
        console.log(`   📄 Medical Files: ${files.length}`);
        console.log("=".repeat(50));

        return {
            success: true,
            counts: {
                specializations: specializations.length,
                hospitals: hospitals.length,
                users: users.length,
                doctors: doctors.length,
                appointments: appointments.length,
                prescriptions: prescriptions.length,
                medications: medications.length,
                userDoctorRelations: userDoctorPairs.length,
                doctorHospitalRelations: doctorHospitalPairs.length,
                files: files.length,
            },
        };
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
};

// Export with different run modes
export default seed;

// Additional export for production-safe seeding
export const safeSeed = (options = {}) =>
    seed({ force: false, skipExisting: true, ...options });

// Export for development with custom options
export const devSeed = (options = {}) =>
    seed({ force: true, skipExisting: false, ...options });

// Export for adding data to existing database (useful for testing)
export const addSeed = (options = {}) =>
    seed({ force: false, skipExisting: false, ...options });
