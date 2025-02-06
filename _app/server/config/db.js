const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    logging: (msg) => logger.debug(msg),  // Enable logging for debugging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 30000,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
    },
    retry: {
        max: 5,
        timeout: 30000
    }
});

// Initialize database connection and sync models
const initDatabase = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        logger.info("Database connection established successfully.");

        try {
            // Import models with associations
            logger.info("Importing models...");
            const models = require('../models/index');
            logger.info("Models imported successfully:", Object.keys(models));

            // Only sync in development
            if (process.env.NODE_ENV === 'development') {
                logger.info("Starting model synchronization...");
                await sequelize.sync({ alter: false });
                logger.info("Models synchronized successfully.");
            }

        } catch (modelError) {
            logger.error("Failed to initialize models:", {
                message: modelError.message,
                stack: modelError.stack
            });
            throw modelError;
        }

    } catch (error) {
        logger.error("Database initialization failed:", {
            message: error.message,
            stack: error.stack,
        });

        // Attempt to reconnect after a delay
        setTimeout(() => {
            logger.info("Attempting to reconnect...");
            initDatabase();
        }, 5000);
    }
};

// Handle process errors
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', {
        message: error.message,
        stack: error.stack
    });
});

// Run initialization
initDatabase().catch(error => {
    logger.error("Fatal database initialization error:", {
        message: error.message,
        stack: error.stack
    });
});

module.exports = sequelize;
