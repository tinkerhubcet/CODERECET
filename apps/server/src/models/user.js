import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const User = Sequelize.define("user", {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuid(),
        primaryKey: true,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        notNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        notNull: true,
    },
    password: {
        type: DataTypes.STRING,
        notNull: true,
        set(value) {
            setDataValue("password", bcrypt.hash(value));
        },
    },
});

export default User;
