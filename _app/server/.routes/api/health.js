const express = require("express");
const router = express.Router();
const logger = require("../../utils/logger");
const { authenticateToken } = require("../../middleware/authMiddleware");
const os = require("os");
const process = require("process");
const sequelize = require("../../config/db");

// Middleware to log route access
const logRequest = (req, res, next) => {
    logger.info(`Health API request: ${req.method} ${req.originalUrl}`);
    next();
};

router.use(logRequest);

// Basic health check - public endpoint with minimal info
router.get("/", async (req, res) => {
    try {
        const dbStatus = sequelize.getConnectionStatus();
        const status = dbStatus.isConnected ? "healthy" : "unhealthy";

        const healthInfo = {
            status,
            timestamp: new Date().toISOString(),
            service: {
                name: "ILYTAT Organizer API",
                environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
            }
        };

        res.status(status === "healthy" ? 200 : 503).json(healthInfo);
    } catch (error) {
        logger.error("Health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString()
        });
    }
});

// Detailed system health check (requires authentication)
router.get("/system", authenticateToken, async (req, res) => {
    try {
        const dbStatus = sequelize.getConnectionStatus();
        const systemInfo = {
            status: dbStatus.isConnected ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            system: {
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem()
                },
                cpu: {
                    cores: os.cpus().length,
                    loadAvg: os.loadavg()
                }
            },
            process: {
                uptime: process.uptime()
            }
        };

        // Only include detailed info in non-production
        if (process.env.NODE_ENV !== 'production') {
            systemInfo.system.platform = process.platform;
            systemInfo.system.arch = process.arch;
            systemInfo.system.nodeVersion = process.version;
            systemInfo.system.memory.processUsage = process.memoryUsage();
            systemInfo.system.cpu.model = os.cpus()[0].model;
            systemInfo.process.pid = process.pid;
            systemInfo.process.title = process.title;
            systemInfo.process.versions = process.versions;
        }

        res.status(dbStatus.isConnected ? 200 : 503).json(systemInfo);
    } catch (error) {
        logger.error("System health check failed:", error);
        res.status(503).json({
            status: "error",
            timestamp: new Date().toISOString()
        });
    }
});

// Database health check (requires authentication)
router.get("/database", authenticateToken, async (req, res) => {
    try {
        const dbStatus = sequelize.getConnectionStatus();
        
        if (!dbStatus.isConnected) {
            throw new Error(dbStatus.error || "Database is not connected");
        }

        const dbInfo = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                dialect: dbStatus.dialect
            }
        };

        // Only include config in non-production
        if (process.env.NODE_ENV !== 'production') {
            dbInfo.database.config = dbStatus.config;
        }

        res.json(dbInfo);
    } catch (error) {
        logger.error("Database health check failed:", error);
        res.status(503).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: {
                connected: false
            }
        });
    }
});

module.exports = router;