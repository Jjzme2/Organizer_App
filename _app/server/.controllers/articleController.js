const BaseController = require('./base/baseController');
const { Article, Category, Comment, User } = require('../models');
const { ApiError } = require('../utils/errorUtils');

class ArticleController extends BaseController {
    constructor() {
        super(Article, 'Article');
        this.defaultIncludes = [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: Comment,
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
     * Get all articles for a user with optional filtering
     * @param {number} userId - User ID
     * @param {Object} filters - Query filters
     */
    async getUserArticles(userId, filters = {}) {
        const options = {
            where: { userId, ...filters },
            include: this.defaultIncludes,
            order: [['createdAt', 'DESC']]
        };
        return this.getAll(options);
    }

    /**
     * Get articles by category
     * @param {number} userId - User ID
     * @param {number} categoryId - Category ID
     */
    async getArticlesByCategory(userId, categoryId) {
        const options = {
            where: { userId, categoryId },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Get featured articles
     * @param {number} userId - User ID
     */
    async getFeaturedArticles(userId) {
        const options = {
            where: { 
                userId,
                isFeatured: true 
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Toggle article featured status
     * @param {number} articleId - Article ID
     * @param {number} userId - User ID
     */
    async toggleFeatured(articleId, userId) {
        const article = await this.findOne({ id: articleId, userId });
        return this.update(articleId, { isFeatured: !article.isFeatured });
    }

    /**
     * Create a new article with validation
     * @param {Object} data - Article data
     */
    async create(data) {
        if (!data.title) {
            throw new ApiError(400, 'Article title is required');
        }
        if (!data.content) {
            throw new ApiError(400, 'Article content is required');
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
     * Update an article with validation
     * @param {number} id - Article ID
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
     * Search articles by title or content
     * @param {number} userId - User ID
     * @param {string} query - Search query
     */
    async searchArticles(userId, query) {
        const options = {
            where: {
                userId,
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { content: { [Op.like]: `%${query}%` } }
                ]
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }
}

module.exports = new ArticleController();