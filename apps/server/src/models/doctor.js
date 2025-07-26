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
        // hospital_id and specialization_id are added via association
    },
    { tableName: "doctors", timestamps: true },
);
