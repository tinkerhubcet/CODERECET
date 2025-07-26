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
});

export default File;
