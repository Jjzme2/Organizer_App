const authUtility = require("../utils/auth");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return handleUnauthorized(req, res);
  }

  try {
    const decoded = authUtility.verifyToken(token);

    // Check token version/timestamp against server's current version
    if (decoded.tokenVersion !== process.env.TOKEN_VERSION) {
      return handleUnauthorized(req, res);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return handleUnauthorized(req, res);
  }
};

const handleUnauthorized = (req, res) => {
  res.setHeader("X-Redirect", "/login");
  logger.error("Authentication failed: Invalid token");
  return res.status(401).json({ error: "Unauthorized" });
};

module.exports = { authenticateToken };
