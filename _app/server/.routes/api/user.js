const express = require("express");
const router = express.Router();
const userController = require("../../.controllers/userController"); // Update the path

// Get all items
router.get("/", userController.getAllItems);

// Get item by ID
router.get("/:id", userController.getItemById);

// Get items by activity
router.get("/active", userController.getItemsByActivity(1));

// Get Item by Username
router.get("/username/:username", userController.getItemByUsername);

// Get Item by Email
router.get("/email/:email", userController.getItemByEmail);

// Create a new item
router.post("/", userController.createItem);

// Update an item by ID
router.put("/:id", userController.updateItem);

// ... add other routes as needed ...

module.exports = router;
