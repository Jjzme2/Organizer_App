const BaseController = require('./base/baseController');
const { Jotting, Category, JottingComment, User } = require('../models');
const { ApiError } = require('../utils/errorUtils');
const { Op } = require('sequelize');

class JottingController extends BaseController {
    constructor() {
        super(Jotting, 'Jotting');
        this.defaultIncludes = [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: JottingComment,
                as: 'comments',
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                }]
            }
        ];
    }

    /**
     * Get all jottings for a user with optional filtering
     * @param {number} userId - User ID
     * @param {Object} filters - Query filters
     */
    async getUserJottings(userId, filters = {}) {
        const options = {
            where: { userId, ...filters },
            include: this.defaultIncludes,
            order: [['createdAt', 'DESC']]
        };
        return this.getAll(options);
    }

    /**
     * Get jottings by category
     * @param {number} userId - User ID
     * @param {number} categoryId - Category ID
     */
    async getJottingsByCategory(userId, categoryId) {
        const options = {
            where: { userId, categoryId },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Get pinned jottings
     * @param {number} userId - User ID
     */
    async getPinnedJottings(userId) {
        const options = {
            where: { 
                userId,
                isPinned: true 
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Toggle jotting pin status
     * @param {number} jottingId - Jotting ID
     * @param {number} userId - User ID
     */
    async togglePin(jottingId, userId) {
        const jotting = await this.findOne({ id: jottingId, userId });
        return this.update(jottingId, { isPinned: !jotting.isPinned });
    }

    /**
     * Create a new jotting with validation
     * @param {Object} data - Jotting data
     */
    async create(data) {
        if (!data.content) {
            throw new ApiError(400, 'Jotting content is required');
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
     * Update a jotting with validation
     * @param {number} id - Jotting ID
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
     * Search jottings by content or tags
     * @param {number} userId - User ID
     * @param {string} query - Search query
     */
    async searchJottings(userId, query) {
        const options = {
            where: {
                userId,
                [Op.or]: [
                    { content: { [Op.like]: `%${query}%` } },
                    { tags: { [Op.like]: `%${query}%` } }
                ]
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Get jottings by date range
     * @param {number} userId - User ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     */
    async getJottingsByDateRange(userId, startDate, endDate) {
        const options = {
            where: {
                userId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: this.defaultIncludes,
            order: [['createdAt', 'DESC']]
        };
        return this.getAll(options);
    }

    /**
     * Get recent jottings
     * @param {number} userId - User ID
     * @param {number} limit - Number of jottings to return
     */
    async getRecentJottings(userId, limit = 5) {
        const options = {
            where: { userId },
            include: this.defaultIncludes,
            order: [['createdAt', 'DESC']],
            limit
        };
        return this.getAll(options);
    }
}

module.exports = new JottingController();