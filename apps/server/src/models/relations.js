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
