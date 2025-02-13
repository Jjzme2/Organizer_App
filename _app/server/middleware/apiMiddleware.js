// middleware/apiMiddleware.js

const logger = require("../utils/logger"); // Or your preferred logger

function apiMiddleware(req, res, next) {
  // Log request details
  logger.debug('API Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: {
      authorization: req.headers.authorization ? 'Bearer [token]' : 'none',
      'content-type': req.headers['content-type']
    }
  });

  // Track response
  const oldSend = res.send;
  res.send = function(data) {
    logger.debug('API Response:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      data: typeof data === 'string' ? JSON.parse(data) : data
    });
    return oldSend.apply(res, arguments);
  };

  // 2. (Optional) Add headers to the response (e.g., CORS headers)
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  // Add other headers as needed
  res.header("X-Powered-By", "ILYTAT");

  // 3. (Optional) Perform any necessary pre-processing or validation
  if (req.method === 'POST' || req.method === 'PUT') {
    const body = req.body;
    if (!body) {
      return res.status(400).json({ error: 'Request body is required' });
    }
  }

  // 4. Call next() to continue to the next middleware or route handler
  next();
};

module.exports = apiMiddleware;
