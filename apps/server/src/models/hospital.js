import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define(
    "Hospital",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.TEXT },
        contact_info: { type: DataTypes.JSONB },
    },
    { tableName: "hospitals", timestamps: true },
);
