const Article = require("../models/Article");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

exports.getAllArticles = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const articles = await Article.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(articles);
  } catch (error) {
    logger.error('Error in getAllArticles:', error);
    throw new AppError("Failed to get articles", 500, "ARTICLE_FETCH_ERROR");
  }
};

exports.getArticleById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const article = await Article.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    res.json(article);
  } catch (error) {
    logger.error('Error in getArticleById:', error);
    throw new AppError("Failed to get article", 500, "ARTICLE_FETCH_ERROR");
  }
};

exports.createArticle = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const article = await Article.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(article);
  } catch (error) {
    logger.error('Error in createArticle:', error);
    throw new AppError("Failed to create article", 500, "ARTICLE_CREATE_ERROR");
  }
};

exports.updateArticle = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const article = await Article.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    await article.update(req.body);
    res.json(article);
  } catch (error) {
    logger.error('Error in updateArticle:', error);
    throw new AppError("Failed to update article", 500, "ARTICLE_UPDATE_ERROR");
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const article = await Article.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    await article.destroy();
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteArticle:', error);
    throw new AppError("Failed to delete article", 500, "ARTICLE_DELETE_ERROR");
  }
};