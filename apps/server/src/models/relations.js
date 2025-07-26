import { User, AuthToken } from "#models";
import { DataTypes } from "sequelize";

await User.hasOne(AuthToken, {
    foreignKey: "userId",
    type: DataTypes.UUID,
    unique: true,
});
