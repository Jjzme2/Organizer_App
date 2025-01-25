const express = require("express");
const router = express.Router();
const taskController = require("../../.controllers/taskController");

// Get all tasks (with optional query parameters for filtering)
router.get("/", taskController.getAllItems);

// Get a task by Name
router.get("/:name", taskController.getItemByName);

module.exports = router;
