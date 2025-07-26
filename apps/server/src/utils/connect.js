import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.POSTGRES_DB || "database",
    process.env.POSTGRES_USER || "user",
    process.env.POSTGRES_PASSWORD || "password",
    {
        host: process.env.POSTGRES_HOST || "prod-db",
        dialect: "postgres",
        port: 5432,
        database: process.env.POSTGRES_DB || "myapp",
    },
);
const connect = async () => {
    console.log(process.env.POSTGRES_DB);

    try {
        await sequelize.authenticate();
        console.log(
            "Connection to the database has been established successfully.",
        );
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};

export default sequelize;
export { connect };
