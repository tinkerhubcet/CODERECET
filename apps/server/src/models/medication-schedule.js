import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define(
    "MedicationSchedule",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // Describes how often the medication should be taken
        frequency: {
            type: DataTypes.ENUM(
                "Once daily",
                "Twice daily",
                "Three times daily",
                "Every other day",
                "Weekly",
                "As needed",
            ),
            allowNull: false,
        },
        // medicationId foreign key is added via associations below
    },
    {
        tableName: "MedicationSchedule",
        timestamps: true,
    },
);
