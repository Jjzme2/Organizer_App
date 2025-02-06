const User = require("../models/User");
const Quote = require("../models/Quote");
const defaultQuotes = require("../config/defaultQuotes");
const logger = require("../utils/logger");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Create default quotes for the new user
    const quotesWithUserId = defaultQuotes.map(quote => ({
      ...quote,
      userId: user.id
    }));

    await Quote.bulkCreate(quotesWithUserId);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    logger.error('Error in createUser:', error);
    throw new AppError("Failed to create user", 500, "USER_CREATE_ERROR");
  }
};