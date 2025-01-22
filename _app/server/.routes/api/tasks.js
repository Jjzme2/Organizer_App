const express = require("express");
const router = express.Router();
const taskController = require("../../.controllers/taskController");

router.get("/", taskController.getAllItems);

router.get("/active", taskController.getItemsByActivity(1));
router.get("/archived", taskController.getItemsByActivity(0));

router.get("/completed", taskController.getItemsByCompletion(1));
router.get("/incomplete", taskController.getItemsByCompletion(0));

router.get("/:id", taskController.getItemById);
// Add other routes (POST for create, PUT for update, DELETE for delete)

module.exports = router;
