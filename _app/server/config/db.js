const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    logging: (msg) => logger.debug(msg)
});

// Initialize database connection and sync models
const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database connection established successfully.");
        
        // Import models with associations
        require('../.models/index');
        
        // Sync all models
        await sequelize.sync({ alter: true });
        logger.info("Database models synchronized successfully.");
    } catch (error) {
        logger.error("Database initialization failed:", error);
        process.exit(1);
    }
};

// Run initialization
initDatabase();

module.exports = sequelize;
