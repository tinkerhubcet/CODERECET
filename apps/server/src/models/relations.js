import {
    User,
    AuthToken,
    Prescription,
    Medication,
    MedicationSchedule,
    File,
    Appointment,
    Doctor,
    Hospital,
    UserDoctor,
    DoctorHospital,
} from "#models";

// --- User <-> AuthToken (One-to-One) ---
User.hasOne(AuthToken, {
    foreignKey: "userId",
    as: "authToken",
    onDelete: "CASCADE",
});
AuthToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// --- User <-> File (One-to-Many) ---
User.hasMany(File, {
    foreignKey: "userId",
    as: "files",
    onDelete: "CASCADE",
});
File.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// --- User <-> Prescription (One-to-Many) ---
User.hasMany(Prescription, {
    foreignKey: "userId",
    as: "prescriptions",
    onDelete: "CASCADE",
});
Prescription.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// --- Prescription <-> Medication (One-to-Many) ---
Prescription.hasMany(Medication, {
    foreignKey: "prescriptionId",
    as: "medications",
    onDelete: "CASCADE",
});
Medication.belongsTo(Prescription, {
    foreignKey: "prescriptionId",
    as: "prescription",
});

// --- Medication <-> MedicationSchedule (One-to-Many) ---
Medication.hasMany(MedicationSchedule, {
    foreignKey: "medicationId",
    as: "schedules",
    onDelete: "CASCADE",
});
MedicationSchedule.belongsTo(Medication, {
    foreignKey: "medicationId",
    as: "medication",
});

// --- User <-> Appointment (One-to-Many) ---
User.hasMany(Appointment, {
    foreignKey: "userId",
    as: "appointments",
    onDelete: "CASCADE",
});
Appointment.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// --- Doctor <-> Appointment (One-to-Many) ---
Doctor.hasMany(Appointment, {
    foreignKey: "doctorId",
    as: "appointments",
});
Appointment.belongsTo(Doctor, {
    foreignKey: "doctorId",
    as: "doctor",
});

// --- Hospital <-> Doctor (One-to-Many) ---
Hospital.hasMany(Doctor, {
    foreignKey: "hospitalId",
    as: "doctors",
});
Doctor.belongsTo(Hospital, {
    foreignKey: "hospitalId",
    as: "hospital",
});

// --- Many-to-Many Relationships with Through Tables ---

// --- User <-> Doctor (Many-to-Many) ---
// A user can have multiple doctors, and a doctor can have multiple patients
User.belongsToMany(Doctor, {
    through: {
        model: UserDoctor,
        unique: false,
    },
    foreignKey: "userId",
    otherKey: "doctorId",
    as: "doctors",
});
Doctor.belongsToMany(User, {
    through: {
        model: UserDoctor,
        unique: false,
    },
    foreignKey: "doctorId",
    otherKey: "userId",
    as: "patients",
});

// --- Doctor <-> Hospital (Many-to-Many) ---
// A doctor can work at multiple hospitals, and a hospital can have multiple doctors
Doctor.belongsToMany(Hospital, {
    through: {
        model: DoctorHospital,
        unique: false,
    },
    foreignKey: "doctorId",
    otherKey: "hospitalId",
    as: "hospitals",
});
Hospital.belongsToMany(Doctor, {
    through: {
        model: DoctorHospital,
        unique: false,
    },
    foreignKey: "hospitalId",
    otherKey: "doctorId",
    as: "affiliatedDoctors",
});
