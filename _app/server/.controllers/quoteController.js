const Quote = require("../.models/Quote");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");
const { Op } = require("sequelize");

exports.getAllQuotes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const quotes = await Quote.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(quotes);
  } catch (error) {
    logger.error('Error in getAllQuotes:', error);
    throw new AppError("Failed to get quotes", 500, "QUOTE_FETCH_ERROR");
  }
};

exports.getRandomQuote = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const quote = await Quote.findOne({
      where: { userId: req.user.id },
      order: [Op.random()]
    });

    if (!quote) {
      return res.json({
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
      });
    }

    res.json(quote);
  } catch (error) {
    logger.error('Error in getRandomQuote:', error);
    throw new AppError("Failed to get random quote", 500, "QUOTE_FETCH_ERROR");
  }
};

exports.createQuote = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const quote = await Quote.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(quote);
  } catch (error) {
    logger.error('Error in createQuote:', error);
    throw new AppError("Failed to create quote", 500, "QUOTE_CREATE_ERROR");
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const quote = await Quote.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!quote) {
      throw new NotFoundError("Quote not found");
    }

    quote.isFavorite = !quote.isFavorite;
    await quote.save();

    res.json(quote);
  } catch (error) {
    logger.error('Error in toggleFavorite:', error);
    throw new AppError("Failed to toggle favorite", 500, "QUOTE_UPDATE_ERROR");
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const quote = await Quote.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!quote) {
      throw new NotFoundError("Quote not found");
    }

    await quote.destroy();
    res.json({ message: "Quote deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteQuote:', error);
    throw new AppError("Failed to delete quote", 500, "QUOTE_DELETE_ERROR");
  }
};