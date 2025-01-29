const express = require("express");
const router = express.Router();
const taskReminderController = require("../../.controllers/taskReminderController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`TaskReminder API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);
router.use(authenticateToken);

router.get("/", taskReminderController.getAllItems);
router.get("/:id", taskReminderController.getItemById);
router.post("/", taskReminderController.createItem);
router.put("/:id", taskReminderController.updateItem);
router.delete("/:id", taskReminderController.deleteItem);

module.exports = router;