import { Sequelize } from "#utils";
import { v4 as uuid } from "uuid";
import { DataTypes } from "sequelize";
const File = Sequelize.define("file", {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuid(),
        primaryKey: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        notNull: true,
    },
    url: {
        type: DataTypes.TEXT, // Use TEXT for URLs as they can be long
        allowNull: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bucket: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default File;
