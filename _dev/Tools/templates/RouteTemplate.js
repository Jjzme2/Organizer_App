/**
 * Model Routes Template
 *
 * How to use:
 * 1. Create a new route file (e.g., 'userRoutes.js', 'productRoutes.js') in your 'routes/api' directory.
 * 2. Copy the contents of this template into your new route file.
 * 3. Update the model name: Replace 'YourModel' with the actual name of your model (e.g., 'User', 'Product').
 * 4. Update the controller path: Update the path to your controller file.
 * 5. Add routes: Add more routes as needed (e.g., POST for create, PUT for update, DELETE for delete, GET by ID).
 */

const express = require("express");
const router = express.Router();
const yourModelController = require("../../.controllers/yourModelController"); // Update the path

// Get all items
router.get("/", yourModelController.getAllItems);

// Get item by ID
router.get("/:id", yourModelController.getItemById);

// Create a new item
router.post("/", yourModelController.createItem);

// Update an item by ID
router.put("/:id", yourModelController.updateItem);

// ... add other routes as needed ...

module.exports = router;
