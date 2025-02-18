const express = require('express');
const { createRouteHandler } = require('./routeUtils');
const logger = require('./logger');

/**
 * HTTP method enum for type safety
 * @enum {string}
 */
const HttpMethod = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete'
};

/**
 * Validates a route configuration
 * @param {Object} route Route configuration to validate
 * @param {string} handlerName Name of the handler
 * @param {string} basePath Base path for error messages
 * @throws {Error} If route configuration is invalid
 */
function validateRouteConfig(route, handlerName, basePath) {
    if (!route.method || !Object.values(HttpMethod).includes(route.method)) {
        throw new Error(
            `Invalid HTTP method for route handler "${handlerName}" at ${basePath}. ` +
            `Method must be one of: ${Object.values(HttpMethod).join(', ')}`
        );
    }

    if (!route.path) {
        throw new Error(
            `Missing path for route handler "${handlerName}" at ${basePath}`
        );
    }

    if (route.middleware && !Array.isArray(route.middleware)) {
        throw new Error(
            `Invalid middleware for route handler "${handlerName}" at ${basePath}. ` +
            'Middleware must be an array'
        );
    }
}

/**
 * Standard CRUD routes configuration
 * @type {Object.<string, Object>}
 */
const standardRoutes = {
    getAll: { 
        method: HttpMethod.GET, 
        path: '/',
        description: 'Get all resources'
    },
    getById: { 
        method: HttpMethod.GET, 
        path: '/:id',
        description: 'Get resource by ID'
    },
    create: { 
        method: HttpMethod.POST, 
        path: '/',
        description: 'Create new resource'
    },
    update: { 
        method: HttpMethod.PUT, 
        path: '/:id',
        description: 'Update resource'
    },
    delete: { 
        method: HttpMethod.DELETE, 
        path: '/:id',
        description: 'Delete resource'
    }
};

/**
 * Creates a standardized route configuration for a resource
 * @param {Object} options Configuration options
 * @param {Object} options.controller The controller instance
 * @param {string} options.basePath Base path for the routes (e.g., '/tasks')
 * @param {Object} [options.routes={}] Custom route configurations
 * @param {Array} [options.middleware=[]] Array of middleware to apply to all routes
 * @param {boolean} [options.includeStandardRoutes=true] Whether to include standard CRUD routes
 * @returns {express.Router} Configured router
 */
function createResourceRouter({
    controller,
    basePath,
    routes = {},
    middleware = [],
    includeStandardRoutes = true
}) {
    if (!controller) {
        throw new Error(`Controller is required for resource router at ${basePath}`);
    }

    if (!basePath) {
        throw new Error('Base path is required for resource router');
    }

    const router = express.Router();

    // Log router creation
    logger.info(`Creating resource router for ${basePath}`);

    // Apply global middleware
    middleware.forEach(mw => {
        if (typeof mw !== 'function') {
            throw new Error(`Invalid middleware for ${basePath}. Middleware must be a function`);
        }
        router.use(mw);
    });

    // Merge routes
    const allRoutes = {
        ...(includeStandardRoutes ? standardRoutes : {}),
        ...routes
    };

    // Register routes
    Object.entries(allRoutes).forEach(([handlerName, config]) => {
        try {
            // Validate route configuration
            validateRouteConfig(config, handlerName, basePath);

            // Check if handler exists in controller
            if (!controller[handlerName]) {
                logger.warn(
                    `Handler "${handlerName}" not found in controller for ${basePath}. ` +
                    `Available methods: ${Object.keys(controller).join(', ')}`
                );
                return;
            }

            // Create full path
            const fullPath = config.path.startsWith('/')
                ? config.path
                : `/${config.path}`;

            // Register route with any route-specific middleware
            router[config.method](
                fullPath,
                ...(config.middleware || []),
                createRouteHandler(controller, handlerName, `${basePath}${fullPath}`)
            );

            // Log route registration
            logger.info(
                `Registered ${config.method.toUpperCase()} ${basePath}${fullPath} ` +
                `-> ${handlerName}${config.description ? ` (${config.description})` : ''}`
            );
        } catch (error) {
            logger.error(
                `Failed to register route "${handlerName}" at ${basePath}: ${error.message}`
            );
            throw error;
        }
    });

    return router;
}

module.exports = { 
    createResourceRouter,
    HttpMethod 
};
