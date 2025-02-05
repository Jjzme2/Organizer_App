class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

const handleSequelizeError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    return new ValidationError(message);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    return new ValidationError(message);
  }
  return new AppError('Database error', 500, 'DATABASE_ERROR');
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  handleSequelizeError
};
