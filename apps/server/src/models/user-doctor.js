import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define("UserDoctor", {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});
