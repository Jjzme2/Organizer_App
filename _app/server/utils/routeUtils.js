const logger = require('./logger');

/**
 * Validates and wraps route handlers with error checking
 * @param {Function} handler - The route handler function
 * @param {string} routeName - Name of the route for logging
 * @returns {Function} Wrapped handler with error checking
 */
const validateRouteHandler = (handler, routeName) => {
    if (!handler || typeof handler !== 'function') {
        const error = new Error(`Invalid route handler for ${routeName}. Handler must be a function.`);
        logger.error(`Route Configuration Error: ${error.message}`);
        throw error;
    }
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Creates a validated route configuration
 * @param {Object} controller - The controller containing the handler methods
 * @param {string} methodName - The name of the controller method to use
 * @param {string} routePath - The route path for logging purposes
 * @returns {Function} Validated and wrapped route handler
 */
const createRouteHandler = (controller, methodName, routePath) => {
    if (!controller) {
        throw new Error(`Controller is undefined for route: ${routePath}`);
    }

    if (!methodName) {
        throw new Error(`Method name is undefined for route: ${routePath}`);
    }

    const handler = controller[methodName];
    if (!handler) {
        throw new Error(
            `Handler method "${methodName}" not found in controller for route: ${routePath}\n` +
            `Available methods: ${Object.keys(controller).join(', ')}`
        );
    }

    return validateRouteHandler(handler, `${routePath}:${methodName}`);
};

/**
 * Wraps Express router methods to provide validation and error handling
 * @param {Object} router - Express router instance
 * @returns {Object} Wrapped router with validation
 */
const wrapRouter = (router) => {
    const methods = ['get', 'post', 'put', 'delete', 'patch'];
    const wrappedRouter = {};

    methods.forEach(method => {
        wrappedRouter[method] = (path, ...handlers) => {
            const validatedHandlers = handlers.map((handler, index) => {
                if (typeof handler === 'function') {
                    return validateRouteHandler(handler, `${path}:middleware${index}`);
                }
                throw new Error(
                    `Invalid handler at position ${index} for route ${path}. Expected function, got ${typeof handler}`
                );
            });
            return router[method](path, ...validatedHandlers);
        };
    });

    return wrappedRouter;
};

module.exports = {
    validateRouteHandler,
    createRouteHandler,
    wrapRouter
};
