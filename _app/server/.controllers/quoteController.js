const BaseController = require('./base/baseController');
const { Quote, Category } = require('../models');
const { ApiError } = require('../utils/errorUtils');
const logger = require("../utils/logger");
const { Op } = require("sequelize");
const defaultQuotes = require("../config/defaultQuotes");

class QuoteController extends BaseController {
    constructor() {
        super(Quote, 'Quote');
        this.defaultIncludes = [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }
        ];
    }

    /**
     * Get all quotes for a user with optional filtering
     * @param {number} userId - User ID
     * @param {Object} filters - Query filters
     */
    async getUserQuotes(userId, filters = {}) {
        const options = {
            where: { userId, ...filters },
            include: this.defaultIncludes,
            order: [['createdAt', 'DESC']]
        };
        return this.getAll(options);
    }

    /**
     * Get quotes by category
     * @param {number} userId - User ID
     * @param {number} categoryId - Category ID
     */
    async getQuotesByCategory(userId, categoryId) {
        const options = {
            where: { userId, categoryId },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Get favorite quotes
     * @param {number} userId - User ID
     */
    async getFavoriteQuotes(userId) {
        const options = {
            where: { 
                userId,
                isFavorite: true 
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Toggle quote favorite status
     * @param {number} quoteId - Quote ID
     * @param {number} userId - User ID
     */
    async toggleFavorite(quoteId, userId) {
        const quote = await this.findOne({ id: quoteId, userId });
        return this.update(quoteId, { isFavorite: !quote.isFavorite });
    }

    /**
     * Get random quotes
     * @param {number} userId - User ID
     * @param {number} limit - Number of quotes to return
     */
    async getRandomQuotes(userId, limit = 1) {
        const options = {
            where: { userId },
            include: this.defaultIncludes,
            order: [sequelize.literal('RAND()')],
            limit
        };
        return this.getAll(options);
    }

    /**
     * Create a new quote with validation
     * @param {Object} data - Quote data
     */
    async create(data) {
        if (!data.content) {
            throw new ApiError(400, 'Quote content is required');
        }
        if (data.categoryId) {
            const category = await Category.findByPk(data.categoryId);
            if (!category) {
                throw new ApiError(404, 'Category not found');
            }
        }
        return super.create(data);
    }

    /**
     * Update a quote with validation
     * @param {number} id - Quote ID
     * @param {Object} data - Update data
     */
    async update(id, data) {
        if (data.categoryId) {
            const category = await Category.findByPk(data.categoryId);
            if (!category) {
                throw new ApiError(404, 'Category not found');
            }
        }
        return super.update(id, data);
    }

    /**
     * Search quotes by content or author
     * @param {number} userId - User ID
     * @param {string} query - Search query
     */
    async searchQuotes(userId, query) {
        const options = {
            where: {
                userId,
                [Op.or]: [
                    { content: { [Op.like]: `%${query}%` } },
                    { author: { [Op.like]: `%${query}%` } }
                ]
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    // Get all quotes for the user
    async getAllQuotes(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const quotes = await this.getUserQuotes(req.user.id);

            res.json(quotes);
        } catch (error) {
            logger.error('Error in getAllQuotes:', error);
            throw new AppError("Failed to get quotes", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Get a random quote for motivation
    async getRandomQuote(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            // Count the number of quotes for the user
            const count = await this.model.count({
                where: { userId: req.user.id }
            });

            if (count === 0) {
                const randomDefault = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
                return res.json(randomDefault);
            }

            // Generate a random offset
            const randomOffset = Math.floor(Math.random() * count);

            // Fetch a random quote using the offset
            const quotes = await this.model.findAll({
                where: { userId: req.user.id },
                limit: 1,
                offset: randomOffset,
                include: this.defaultIncludes
            });

            res.json(quotes[0]);
        } catch (error) {
            logger.error('Error in getRandomQuote:', error);
            throw new AppError("Failed to get random quote", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Get random quotes
    async getRandom(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const { count = 1, categoryId } = req.query;
            const where = { userId: req.user.id };
            
            if (categoryId) {
                where.categoryId = categoryId;
            }

            const quotes = await this.getRandomQuotes(req.user.id, parseInt(count));

            res.json(quotes);
        } catch (error) {
            logger.error('Error in getRandom:', error);
            throw new AppError("Failed to get random quotes", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Get favorite quotes
    async getFavorites(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { rows: quotes, count } = await this.model.findAndCountAll({
                where: {
                    userId: req.user.id,
                    isFavorite: true
                },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: this.defaultIncludes
            });

            res.json({
                items: quotes,
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            logger.error('Error in getFavorites:', error);
            throw new AppError("Failed to get favorite quotes", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Get quotes by author
    async getByAuthor(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const { author } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { rows: quotes, count } = await this.model.findAndCountAll({
                where: {
                    userId: req.user.id,
                    author: {
                        [Op.like]: `%${author}%`
                    }
                },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: this.defaultIncludes
            });

            res.json({
                items: quotes,
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            logger.error('Error in getByAuthor:', error);
            throw new AppError("Failed to get quotes by author", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Get quotes by tag
    async getByTag(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const { tag } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { rows: quotes, count } = await this.model.findAndCountAll({
                where: {
                    userId: req.user.id,
                    tags: {
                        [Op.like]: `%${tag}%`
                    }
                },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: this.defaultIncludes
            });

            res.json({
                items: quotes,
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            logger.error('Error in getByTag:', error);
            throw new AppError("Failed to get quotes by tag", 500, "QUOTE_FETCH_ERROR");
        }
    };

    // Create a new quote
    async createQuote(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const quote = await this.create({
                ...req.body,
                userId: req.user.id
            });

            res.status(201).json(quote);
        } catch (error) {
            logger.error('Error in createQuote:', error);
            throw new AppError("Failed to create quote", 500, "QUOTE_CREATE_ERROR");
        }
    };

    // Delete a quote
    async deleteQuote(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const quote = await this.findOne({ id: req.params.id, userId: req.user.id });

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

    // Update a quote
    async updateQuote(req, res) {
        try {
            if (!req.user || !req.user.id) {
                throw new AuthenticationError();
            }

            const quote = await this.findOne({ id: req.params.id, userId: req.user.id });

            if (!quote) {
                throw new NotFoundError("Quote not found");
            }

            await quote.update(req.body);
            res.json(quote);
        } catch (error) {
            logger.error('Error in updateQuote:', error);
            throw new AppError("Failed to update quote", 500, "QUOTE_UPDATE_ERROR");
        }
    };
}

module.exports = new QuoteController();