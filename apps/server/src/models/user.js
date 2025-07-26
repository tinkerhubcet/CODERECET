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
            this.setDataValue("password", bcrypt.hash(value, 10));
        },
    },
});

User.prototype.comparePassword = function (user, password) {
    return bcrypt.compare(password, user.password);
};

export default User;
