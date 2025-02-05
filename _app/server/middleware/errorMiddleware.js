const logger = require('../utils/logger');
const { AppError, handleSequelizeError } = require('../utils/errorUtils');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode
  });

  // Handle Sequelize errors
  if (err.name && err.name.startsWith('Sequelize')) {
    err = handleSequelizeError(err);
  }

  // If it's our custom error, send structured response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      code: err.code,
      message: err.message,
      errors: err.errors || undefined
    });
  }

  // For unexpected errors, send generic response
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};

module.exports = errorHandler;
