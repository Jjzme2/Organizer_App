const express = require("express");
const router = express.Router();
const categoryController = require("../../.controllers/categoryController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`Category API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);
router.use(authenticateToken);

router.get("/", categoryController.getAllItems);
router.get("/:id", categoryController.getItemById);
router.post("/", categoryController.createItem);
router.put("/:id", categoryController.updateItem);
router.delete("/:id", categoryController.deleteItem);

module.exports = router;