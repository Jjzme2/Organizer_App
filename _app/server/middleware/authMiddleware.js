const authUtility = require("../utils/auth");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    logger.error("Authentication failed: No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = authUtility.verifyToken(token);
  if (decoded) {
    req.user = decoded;
    next();
  } else {
    logger.error("Authentication failed: Invalid token");
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = { authenticateToken };
