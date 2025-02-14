const express = require("express");
const router = express.Router();
const contactILYTATController = require("../../.controllers/_contactController");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
};

router.use(logRequest);

router.get("/", contactILYTATController.getILYTATContactInfo);

module.exports = router;