const BaseController = require('./base/baseController');
const { Task, Category } = require('../models');
const { ApiError } = require('../utils/errorUtils');

class TaskController extends BaseController {
    constructor() {
        super(Task, 'Task');
        this.defaultIncludes = [
            { 
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            }
        ];
    }

    /**
     * Get all tasks for a user with optional filtering
     * @param {number} userId - User ID
     * @param {Object} filters - Query filters
     */
    async getUserTasks(userId, filters = {}) {
        const options = {
            where: { userId, ...filters },
            include: this.defaultIncludes,
            order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
        };
        return this.getAll(options);
    }

    /**
     * Get tasks by category
     * @param {number} userId - User ID
     * @param {number} categoryId - Category ID
     */
    async getTasksByCategory(userId, categoryId) {
        const options = {
            where: { userId, categoryId },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Toggle task completion status
     * @param {number} taskId - Task ID
     * @param {number} userId - User ID
     */
    async toggleComplete(taskId, userId) {
        const task = await this.findOne({ id: taskId, userId });
        return this.update(taskId, { completed: !task.completed });
    }

    /**
     * Get overdue tasks
     * @param {number} userId - User ID
     */
    async getOverdueTasks(userId) {
        const options = {
            where: {
                userId,
                dueDate: { $lt: new Date() },
                completed: false
            },
            include: this.defaultIncludes
        };
        return this.getAll(options);
    }

    /**
     * Create a new task with validation
     * @param {Object} data - Task data
     */
    async create(data) {
        if (!data.title) {
            throw new ApiError(400, 'Task title is required');
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
     * Update a task with validation
     * @param {number} id - Task ID
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
}

module.exports = new TaskController();