const express = require("express");
const router = express.Router();
const quoteController = require("../../.controllers/quoteController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`Quote API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);
router.use(authenticateToken);

router.get("/", quoteController.getAllQuotes);
router.get("/random", quoteController.getRandomQuote);
router.post("/", quoteController.createQuote);
router.put("/:id/favorite", quoteController.toggleFavorite);
router.delete("/:id", quoteController.deleteQuote);

module.exports = router;