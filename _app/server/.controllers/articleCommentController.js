const ArticleComment = require("../models/ArticleComment");
const Article = require("../models/Article");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

exports.getAllComments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const comments = await ArticleComment.findAll({
      where: { articleId: req.params.articleId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Article,
        where: { userId: req.user.id },
        attributes: ['id', 'title']
      }]
    });

    res.json(comments);
  } catch (error) {
    logger.error('Error in getAllComments:', error);
    throw new AppError("Failed to get comments", 500, "COMMENT_FETCH_ERROR");
  }
};

exports.createComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    // Verify the article exists and belongs to the user
    const article = await Article.findOne({
      where: {
        id: req.params.articleId,
        userId: req.user.id
      }
    });

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    const comment = await ArticleComment.create({
      content: req.body.content,
      articleId: req.params.articleId,
      userId: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    logger.error('Error in createComment:', error);
    throw new AppError("Failed to create comment", 500, "COMMENT_CREATE_ERROR");
  }
};

exports.updateComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const comment = await ArticleComment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    await comment.update({ content: req.body.content });
    res.json(comment);
  } catch (error) {
    logger.error('Error in updateComment:', error);
    throw new AppError("Failed to update comment", 500, "COMMENT_UPDATE_ERROR");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const comment = await ArticleComment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteComment:', error);
    throw new AppError("Failed to delete comment", 500, "COMMENT_DELETE_ERROR");
  }
};