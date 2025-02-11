const express = require("express");
const router = express.Router();
const jottingCommentController = require("../../.controllers/jottingCommentController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const logger = require("../../utils/logger");

const logRequest = (req, res, next) => {
    logger.info(`JottingComment API request: ${req.method} ${req.originalUrl}`);
    logger.debug('Request body:', req.body);
    next();
};

router.use(logRequest);
router.use(authenticateToken);

// Get all comments for a specific jotting
router.get("/jotting/:jottingId", jottingCommentController.getAllComments);

// Create a new comment for a jotting
router.post("/jotting/:jottingId", jottingCommentController.createComment);

// Update a comment
router.put("/:id", jottingCommentController.updateComment);

// Delete a comment
router.delete("/:id", jottingCommentController.deleteComment);

module.exports = router;