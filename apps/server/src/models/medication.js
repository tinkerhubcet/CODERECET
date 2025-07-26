import { DataTypes } from "sequelize";
import { Sequelize } from "#utils";

export default Sequelize.define("Medication", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dosage: {
        type: DataTypes.STRING, // e.g., "500mg", "1 tablet"
        allowNull: false,
    },
    instructions: {
        type: DataTypes.TEXT, // e.g., "Take with food", "Avoid dairy"
    },
    // prescriptionId foreign key is added via associations below
});
