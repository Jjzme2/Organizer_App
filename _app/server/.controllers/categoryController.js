const BaseController = require('./base/baseController');
const { Category, Task, Article, Quote, Jotting } = require('../models');
const { ApiError } = require('../utils/errorUtils');
const { Op } = require('sequelize');

class CategoryController extends BaseController {
    constructor() {
        super(Category, 'Category');
        this.defaultIncludes = [
            {
                model: Task,
                as: 'tasks',
                attributes: ['id', 'title']
            },
            {
                model: Article,
                as: 'articles',
                attributes: ['id', 'title']
            },
            {
                model: Quote,
                as: 'quotes',
                attributes: ['id', 'content']
            },
            {
                model: Jotting,
                as: 'jottings',
                attributes: ['id', 'content']
            }
        ];
    }

    /**
     * Get all categories for a user with optional filtering
     * @param {number} userId - User ID
     * @param {Object} filters - Query filters
     */
    async getUserCategories(userId, filters = {}) {
        const options = {
            where: { userId, ...filters },
            include: this.defaultIncludes,
            order: [['name', 'ASC']]
        };
        return this.getAll(options);
    }

    /**
     * Get category with item counts
     * @param {number} categoryId - Category ID
     * @param {number} userId - User ID
     */
    async getCategoryWithCounts(categoryId, userId) {
        const category = await this.findOne({ id: categoryId, userId });
        
        const [tasks, articles, quotes, jottings] = await Promise.all([
            Task.count({ where: { categoryId } }),
            Article.count({ where: { categoryId } }),
            Quote.count({ where: { categoryId } }),
            Jotting.count({ where: { categoryId } })
        ]);

        return {
            ...category.toJSON(),
            counts: {
                tasks,
                articles,
                quotes,
                jottings,
                total: tasks + articles + quotes + jottings
            }
        };
    }

    /**
     * Get categories with item counts
     * @param {number} userId - User ID
     */
    async getCategoriesWithCounts(userId) {
        const categories = await this.getUserCategories(userId);
        
        const categoriesWithCounts = await Promise.all(
            categories.map(category => this.getCategoryWithCounts(category.id, userId))
        );

        return categoriesWithCounts;
    }

    /**
     * Create a new category with validation
     * @param {Object} data - Category data
     */
    async create(data) {
        if (!data.name) {
            throw new ApiError(400, 'Category name is required');
        }

        // Check for duplicate category names for the user
        const existing = await this.findOne({
            name: data.name,
            userId: data.userId
        }).catch(() => null);

        if (existing) {
            throw new ApiError(400, 'Category with this name already exists');
        }

        return super.create(data);
    }

    /**
     * Update a category with validation
     * @param {number} id - Category ID
     * @param {Object} data - Update data
     */
    async update(id, data) {
        if (data.name) {
            // Check for duplicate category names for the user
            const existing = await this.findOne({
                name: data.name,
                userId: data.userId,
                id: { [Op.ne]: id }
            }).catch(() => null);

            if (existing) {
                throw new ApiError(400, 'Category with this name already exists');
            }
        }

        return super.update(id, data);
    }

    /**
     * Delete a category and optionally reassign items
     * @param {number} id - Category ID
     * @param {number} newCategoryId - New category ID for reassignment
     */
    async deleteAndReassign(id, newCategoryId = null) {
        const category = await this.getById(id);

        if (newCategoryId) {
            const newCategory = await this.getById(newCategoryId);
            if (!newCategory) {
                throw new ApiError(404, 'New category not found');
            }

            // Reassign all items to the new category
            await Promise.all([
                Task.update({ categoryId: newCategoryId }, { where: { categoryId: id } }),
                Article.update({ categoryId: newCategoryId }, { where: { categoryId: id } }),
                Quote.update({ categoryId: newCategoryId }, { where: { categoryId: id } }),
                Jotting.update({ categoryId: newCategoryId }, { where: { categoryId: id } })
            ]);
        }

        return super.delete(id);
    }

    /**
     * Search categories by name
     * @param {number} userId - User ID
     * @param {string} query - Search query
     */
    async searchCategories(userId, query) {
        const options = {
            where: {
                userId,
                name: { [Op.like]: `%${query}%` }
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Get empty categories
     * @param {number} userId - User ID
     */
    async getEmptyCategories(userId) {
        const categories = await this.getUserCategories(userId);
        const categoriesWithCounts = await this.getCategoriesWithCounts(userId);
        
        return categoriesWithCounts.filter(category => category.counts.total === 0);
    }
}

module.exports = new CategoryController();
