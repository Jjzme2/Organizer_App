const authUtility = require("../utils/auth");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format


  console.log("Token: ", token);
  if (!token) {
    handleUnauthorized(req, res, next);
  }

  const decoded = authUtility.verifyToken(token);
  if (decoded) {
    req.user = decoded;
    next();
  } else {
    handleUnauthorized(req, res, next);
  }
};

const handleUnauthorized = (req, res, next) => {
  res.setHeader("X-Redirect", "/login");
  logger.error("Authentication failed: Invalid token");
  res.status(401).json({ error: "Unauthorized" });
  next();
};

module.exports = { authenticateToken };
