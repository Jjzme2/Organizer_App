const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

let isConnected = false;
let connectionError = null;

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
            require: true,
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
        isConnected = true;
        connectionError = null;
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
            connectionError = modelError;
            throw modelError;
        }

    } catch (error) {
        isConnected = false;
        connectionError = error;
        logger.error("Unable to connect to the database:", {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// Handle process errors
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', {
        message: error.message,
        stack: error.stack
    });
    isConnected = false;
    connectionError = error;
});

// Add connection status methods to sequelize instance
sequelize.getConnectionStatus = () => ({
    isConnected,
    error: connectionError ? connectionError.message : null,
    dialect: sequelize.getDialect(),
    // Only expose non-sensitive configuration
    config: {
        host: process.env.NODE_ENV === 'production' ? '***' : sequelize.config.host,
        database: process.env.NODE_ENV === 'production' ? '***' : sequelize.config.database
    }
});

// Run initialization
initDatabase().catch(error => {
    logger.error("Fatal database initialization error:", {
        message: error.message,
        stack: error.stack
    });
});

// Export both the sequelize instance and initDatabase function
module.exports = sequelize;
module.exports.initDatabase = initDatabase;
