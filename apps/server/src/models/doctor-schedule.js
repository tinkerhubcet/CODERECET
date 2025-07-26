import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define(
    "DoctorSchedule",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        day_of_week: { type: DataTypes.INTEGER, allowNull: false }, // 0=Sunday, 1=Monday, ...
        start_time: { type: DataTypes.TIME, allowNull: false }, // "HH:MM:SS"
        end_time: { type: DataTypes.TIME, allowNull: false }, // "HH:MM:SS"
        slot_duration_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 15,
        },
        // doctor_id is added via association
    },
    { tableName: "doctor_schedules", timestamps: true },
);
