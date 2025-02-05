const express = require("express");
const router = express.Router();
const categoryController = require("../../.controllers/categoryController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

// Middleware to log route access
const logRequest = (req, res, next) => {
    logger.info(`Category API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);

// Get all categories
router.get("/", authenticateToken, categoryController.getAllCategories);

// Create a new category
router.post("/", authenticateToken, categoryController.createCategory);

// Update a category
router.put("/:id", authenticateToken, categoryController.updateCategory);

// Delete a category
router.delete("/:id", authenticateToken, categoryController.deleteCategory);

module.exports = router;
