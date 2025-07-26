import { Sequelize } from "#utils";
import { DataTypes } from "sequelize";

export default Sequelize.define("Prescription", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clinicName: {
        type: DataTypes.STRING,
    },
    dateIssued: {
        type: DataTypes.DATEONLY, // Stores date as 'YYYY-MM-DD'
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
    },
});
