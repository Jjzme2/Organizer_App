// middleware/apiMiddleware.js

const logger = require("../utils/logger"); // Or your preferred logger

const apiMiddleware = (req, res, next) => {
  // 1. Log the request (including method, URL, and optionally headers or body)
  logger.info(`API request: ${req.method} ${req.originalUrl}`);
  logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);

  // 2. (Optional) Add headers to the response (e.g., CORS headers)
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  // Add other headers as needed

  // 3. (Optional) Perform any necessary pre-processing or validation

  // 4. Call next() to continue to the next middleware or route handler
  next();
};

module.exports = apiMiddleware;
