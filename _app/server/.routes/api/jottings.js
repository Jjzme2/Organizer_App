const express = require("express");
const router = express.Router();
const jottingController = require("../../.controllers/jottingController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`Jotting API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);
router.use(authenticateToken);

router.get("/", jottingController.getAllJottings);
router.get("/:id", jottingController.getJottingById);
router.post("/", jottingController.createJotting);
router.put("/:id", jottingController.updateJotting);
router.delete("/:id", jottingController.deleteJotting);

module.exports = router;