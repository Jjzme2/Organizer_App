const ArticleComment = require("../models/ArticleComment");
const Article = require("../models/Article");
const CommentController = require("./base/commentController");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

class ArticleCommentController extends CommentController {
  constructor() {
    super(ArticleComment, "ArticleComment", Article, "articleId");
    this.logger = logger;
  }
}

module.exports = new ArticleCommentController();