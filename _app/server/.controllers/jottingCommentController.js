const JottingComment = require("../models/JottingComment");
const Jotting = require("../models/Jotting");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

exports.getAllComments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const comments = await JottingComment.findAll({
      where: { jottingId: req.params.jottingId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Jotting,
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

    // Verify the jotting exists and belongs to the user
    const jotting = await Jotting.findOne({
      where: {
        id: req.params.jottingId,
        userId: req.user.id
      }
    });

    if (!jotting) {
      throw new NotFoundError("Jotting not found");
    }

    const comment = await JottingComment.create({
      content: req.body.content,
      jottingId: req.params.jottingId,
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

    const comment = await JottingComment.findOne({
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

    const comment = await JottingComment.findOne({
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