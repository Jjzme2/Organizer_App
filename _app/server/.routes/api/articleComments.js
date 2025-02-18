const express = require("express");
const router = express.Router();
const articleCommentController = require("../../.controllers/articleCommentController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const { createRequestLogger } = require("../../middleware/loggingMiddleware");

const logRequest = createRequestLogger('ArticleComment');

router.use(logRequest);
router.use(authenticateToken);

// Get all comments for a specific article
router.get("/article/:articleId", articleCommentController.getAllComments);

// Create a new comment for an article
router.post("/article/:articleId", articleCommentController.createComment);

// Update a comment
router.put("/:id", articleCommentController.updateComment);

// Delete a comment
router.delete("/:id", articleCommentController.deleteComment);

module.exports = router;