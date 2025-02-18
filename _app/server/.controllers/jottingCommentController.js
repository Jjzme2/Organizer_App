const JottingComment = require("../models/JottingComment");
const Jotting = require("../models/Jotting");
const CommentController = require("./base/commentController");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

class JottingCommentController extends CommentController {
  constructor() {
    super(JottingComment, "JottingComment", Jotting, "jottingId");
  }
}

module.exports = new JottingCommentController();