const { ValidationError } = require('sequelize');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/errorUtils');

/**
 * Base controller class providing common CRUD operations and error handling
 */
class BaseController {
    /**
     * @param {Object} model - Sequelize model
     * @param {string} resourceName - Name of the resource (e.g., 'Task', 'User')
     */
    constructor(model, resourceName) {
        this.model = model;
        this.resourceName = resourceName;
    }

    /**
     * Common error handler for controller methods
     * @param {Error} error - Error to handle
     * @param {string} operation - Operation being performed
     * @throws {ApiError} Transformed API error
     */
    handleError(error, operation) {
        logger.error(`${this.resourceName} controller error during ${operation}:`, error);

        if (error instanceof ValidationError) {
            throw new ApiError(400, `Validation error: ${error.message}`);
        }
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, `Error during ${operation} of ${this.resourceName.toLowerCase()}`);
    }

    /**
     * Get all resources with optional filtering
     * @param {Object} options - Query options
     */
    async getAll(options = {}) {
        try {
            return await this.model.findAll(options);
        } catch (error) {
            this.handleError(error, 'getAll');
        }
    }

    /**
     * Get a single resource by ID
     * @param {number|string} id - Resource ID
     * @param {Object} options - Query options
     */
    async getById(id, options = {}) {
        try {
            const resource = await this.model.findByPk(id, options);
            if (!resource) {
                throw new ApiError(404, `${this.resourceName} not found`);
            }
            return resource;
        } catch (error) {
            this.handleError(error, 'getById');
        }
    }

    /**
     * Create a new resource
     * @param {Object} data - Resource data
     * @param {Object} options - Creation options
     */
    async create(data, options = {}) {
        try {
            return await this.model.create(data, options);
        } catch (error) {
            this.handleError(error, 'create');
        }
    }

    /**
     * Update a resource
     * @param {number|string} id - Resource ID
     * @param {Object} data - Update data
     * @param {Object} options - Update options
     */
    async update(id, data, options = {}) {
        try {
            const resource = await this.getById(id);
            await resource.update(data, options);
            return resource;
        } catch (error) {
            this.handleError(error, 'update');
        }
    }

    /**
     * Delete a resource
     * @param {number|string} id - Resource ID
     * @param {Object} options - Deletion options
     */
    async delete(id, options = {}) {
        try {
            const resource = await this.getById(id);
            await resource.destroy(options);
            return { message: `${this.resourceName} deleted successfully` };
        } catch (error) {
            this.handleError(error, 'delete');
        }
    }

    /**
     * Find one resource by criteria
     * @param {Object} where - Search criteria
     * @param {Object} options - Query options
     */
    async findOne(where, options = {}) {
        try {
            const resource = await this.model.findOne({ ...options, where });
            if (!resource) {
                throw new ApiError(404, `${this.resourceName} not found`);
            }
            return resource;
        } catch (error) {
            this.handleError(error, 'findOne');
        }
    }

    /**
     * Count resources matching criteria
     * @param {Object} where - Count criteria
     */
    async count(where = {}) {
        try {
            return await this.model.count({ where });
        } catch (error) {
            this.handleError(error, 'count');
        }
    }
}

module.exports = BaseController;