import { DataTypes } from "sequelize";

export default sequelize.define(
    "Specialization",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT },
    },
    { tableName: "specializations", timestamps: true },
);
