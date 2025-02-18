const express = require("express");
const router = express.Router();
const contactILYTATController = require("../../.controllers/_contactController");
const { createRequestLogger } = require("../../middleware/loggingMiddleware");

// Create request logger for contact
const logRequest = createRequestLogger('Contact');

router.use(logRequest);

router.get("/", contactILYTATController.getILYTATContactInfo);

module.exports = router;