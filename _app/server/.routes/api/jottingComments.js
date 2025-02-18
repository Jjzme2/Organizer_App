const express = require("express");
const router = express.Router();
const jottingCommentController = require("../../.controllers/jottingCommentController");
const { authenticateToken } = require("../../utils/auth");
const { createRequestLogger } = require("../../middleware/loggingMiddleware");

// Create request logger for jotting comments
const logRequest = createRequestLogger('JottingComment');

router.use(logRequest);

// Get all comments for a jotting
router.get("/:jottingId", authenticateToken, jottingCommentController.getAllComments);

// Create a new comment
router.post("/:jottingId", authenticateToken, jottingCommentController.createComment);

// Update a comment
router.put("/:id", authenticateToken, jottingCommentController.updateComment);

// Delete a comment
router.delete("/:id", authenticateToken, jottingCommentController.deleteComment);

module.exports = router;