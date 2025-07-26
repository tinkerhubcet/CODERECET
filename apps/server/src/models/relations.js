import {
    User,
    AuthToken,
    Prescription,
    Medication,
    MedicationSchedule,
} from "#models";
import { DataTypes } from "sequelize";

await User.hasOne(AuthToken, {
    foreignKey: "userId",
    type: DataTypes.UUID,
    unique: true,
});

await User.hasMany(File, {
    foreignKey: "userId",
    type: DataTypes.UUID,
});

// --- User <-> Prescription (One-to-Many) ---
// A user can have many prescriptions.
User.hasMany(Prescription, {
    foreignKey: {
        name: "userId",
        type: DataTypes.UUID,
        allowNull: false,
    },
    as: "prescriptions", // Alias for when you query
});
// Each prescription belongs to a single user.
Prescription.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// --- Prescription <-> Medication (One-to-Many) ---
// A prescription can list many medications.
Prescription.hasMany(Medication, {
    foreignKey: {
        name: "prescriptionId",
        type: DataTypes.UUID,
        allowNull: false,
    },
    as: "medications",
    onDelete: "CASCADE", // If a prescription is deleted, delete its medications
});
// Each medication is part of a single prescription.
Medication.belongsToMany(Prescription, {
    foreignKey: "prescriptionId",
    as: "prescription",
});

// --- Medication <-> MedicationSchedule (One-to-Many) ---
// A single medication can have multiple scheduled times (e.g., morning and night).
Medication.hasMany(MedicationSchedule, {
    foreignKey: {
        name: "medicationId",
        type: DataTypes.UUID,
        allowNull: false,
    },
    as: "schedules",
    onDelete: "CASCADE", // If a medication is deleted, delete its schedules
});
// Each schedule entry belongs to one specific medication.
// This is the correct relationship, ensuring schedules are tied to the medication itself.
MedicationSchedule.belongsTo(Medication, {
    foreignKey: "medicationId",
    as: "medication",
});
