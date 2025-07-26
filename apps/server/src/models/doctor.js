import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define(
    "Doctor",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        qualifications: { type: DataTypes.STRING },
        // hospital_id is added via association in models/index.js
    },
    { tableName: "doctors", timestamps: true },
);
