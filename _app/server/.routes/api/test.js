const express = require('express');
const logger = require('winston'); // Assuming you have Winston configured

const router = express.Router();

// Example route (replace with your actual API logic)
router.get("/announce", (req, res) => {
  logger.info("Test route accessed"); // Example Winston log
  res.send("Hello from my API!");
});

module.exports = router;