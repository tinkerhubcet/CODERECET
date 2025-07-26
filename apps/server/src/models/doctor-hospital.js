import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define("DoctorHospital", {
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    hospitalId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});
