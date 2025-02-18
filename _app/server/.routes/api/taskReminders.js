const express = require("express");
const router = express.Router();
const taskReminderController = require("../../.controllers/taskReminderController");
const { authenticateToken } = require("../../utils/auth");
const { createRequestLogger } = require("../../middleware/loggingMiddleware");

const logRequest = createRequestLogger('TaskReminder');

router.use(logRequest);
router.use(authenticateToken);

router.get("/task/:taskId", taskReminderController.getRemindersForTask);
router.get("/", taskReminderController.getUserReminders);
router.post("/", taskReminderController.createReminder);
router.put("/:id", taskReminderController.updateReminder);
router.delete("/:id", taskReminderController.deleteReminder);

module.exports = router;