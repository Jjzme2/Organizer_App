const express = require("express");
const router = express.Router();
const taskController = require("../../.controllers/taskController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

// Middleware to log route access
const logRequest = (req, res, next) => {
    logger.info(`Task API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);

// Get all tasks (with optional query parameters for filtering)
router.get("/", authenticateToken, taskController.getAllItems);

// Get a task by Name
router.get("/:name", authenticateToken, taskController.getItemByName);

// Create a new task
router.post("/", authenticateToken, taskController.createItem);

// Update a task
router.put("/:id", authenticateToken, taskController.updateItem);

// Deactivate a task
router.put("/:id/deactivate", authenticateToken, taskController.deactivateItem);

module.exports = router;
