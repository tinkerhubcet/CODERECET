import { DataTypes } from "sequelize";

export default sequelize.define(
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
