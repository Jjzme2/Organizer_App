const BaseController = require("./baseController");
const { AuthenticationError, NotFoundError, AppError } = require("../../utils/errorUtils");

class CommentController extends BaseController {
  constructor(model, name, parentModel, parentIdField) {
    super(model, name, {
      searchFields: ['content'],
      includes: [{ model: parentModel }],
      toggleFields: {
        isPinned: true,
        isFeatured: true
      }
    });
    this.parentModel = parentModel;
    this.parentIdField = parentIdField;
  }

  // Override getAll to get comments for a specific parent
  getAll = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      // Verify parent exists and belongs to user
      const parent = await this.parentModel.findOne({
        where: {
          id: req.params[this.parentIdField],
          userId: req.user.id
        }
      });

      if (!parent) {
        throw new NotFoundError(`${this.parentModel.name} not found`);
      }

      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      const { rows: comments, count } = await this.model.findAndCountAll({
        where: { [this.parentIdField]: req.params[this.parentIdField] },
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{
          model: this.parentModel,
          attributes: ['id', 'title'],
          where: { userId: req.user.id }
        }]
      });

      res.json({
        items: comments,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      this.logger.error(`Error in getAll for ${this.name}:`, error);
      throw new AppError(`Failed to get comments`, 500, "COMMENT_FETCH_ERROR");
    }
  };

  // Override create to validate parent and set parentId
  create = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      // Verify parent exists and belongs to user
      const parent = await this.parentModel.findOne({
        where: {
          id: req.params[this.parentIdField],
          userId: req.user.id
        }
      });

      if (!parent) {
        throw new NotFoundError(`${this.parentModel.name} not found`);
      }

      const comment = await this.model.create({
        content: req.body.content,
        [this.parentIdField]: req.params[this.parentIdField],
        userId: req.user.id
      });

      const commentWithIncludes = await this.model.findByPk(comment.id, {
        include: [{
          model: this.parentModel,
          attributes: ['id', 'title']
        }]
      });

      res.status(201).json(commentWithIncludes);
    } catch (error) {
      this.logger.error(`Error in create for ${this.name}:`, error);
      throw new AppError(`Failed to create comment`, 500, "COMMENT_CREATE_ERROR");
    }
  };

  // Get filtered comments (pinned/featured)
  getFilteredComments = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const { filter } = req.params;
      if (!this.options.toggleFields[filter]) {
        throw new AppError(`Invalid filter field: ${filter}`, 400, "INVALID_FILTER_FIELD");
      }

      const comments = await this.model.findAll({
        where: { 
          [this.parentIdField]: req.params[this.parentIdField],
          [filter]: true
        },
        order: [['createdAt', 'DESC']],
        include: [{
          model: this.parentModel,
          where: { userId: req.user.id },
          attributes: ['id', 'title']
        }]
      });

      res.json(comments);
    } catch (error) {
      this.logger.error(`Error in getFilteredComments for ${this.name}:`, error);
      throw new AppError(`Failed to get filtered comments`, 500, "COMMENT_FETCH_ERROR");
    }
  };
}

const { Article, Jotting, Comment } = require('../../models');

// Create controller instances for different comment types
const articleCommentController = new CommentController(Comment, 'ArticleComment', Article, 'articleId');
const jottingCommentController = new CommentController(Comment, 'JottingComment', Jotting, 'jottingId');

module.exports = {
  CommentController,
  articleCommentController,
  jottingCommentController
};
