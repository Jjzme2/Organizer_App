const logger = require("../utils/logger");

/**
 * Middleware for logging API requests
 * @param {string} serviceName - Name of the service/route being logged (e.g., 'Category', 'Task')
 * @returns {Function} Express middleware function
 */
const createRequestLogger = (serviceName) => {
    return (req, res, next) => {
        logger.info(`${serviceName} API request: ${req.method} ${req.originalUrl}`);
        
        // Only log request body for POST and PUT requests
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            // Clone the request body and remove sensitive fields
            const sanitizedBody = { ...req.body };
            ['password', 'token', 'apiKey'].forEach(field => {
                if (sanitizedBody[field]) {
                    sanitizedBody[field] = '[REDACTED]';
                }
            });
            logger.debug('Request body:', sanitizedBody);
        }

        // Log query parameters if present
        if (Object.keys(req.query).length > 0) {
            logger.debug('Query parameters:', req.query);
        }

        // Log route parameters if present
        if (Object.keys(req.params).length > 0) {
            logger.debug('Route parameters:', req.params);
        }

        // Log user information if available
        if (req.user) {
            logger.debug('User:', { id: req.user.id, role: req.user.role });
        }

        next();
    };
};

module.exports = {
    createRequestLogger
};
