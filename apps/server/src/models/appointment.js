import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define(
    "Appointment",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        appointment_time: { type: DataTypes.DATE, allowNull: false },
        status: {
            type: DataTypes.ENUM("SCHEDULED", "COMPLETED", "CANCELLED"),
            allowNull: false,
            defaultValue: "SCHEDULED",
        },
        notes: { type: DataTypes.TEXT },
        // doctor_id and user_id are added via association
    },
    { tableName: "appointments", timestamps: true },
);
