const express = require('express');
const logger = require("../../utils/logger");
const emailService = require('../../services/emailService');

const router = express.Router();

// Example route (replace with your actual API logic)
router.get("/announce", (req, res) => {
  logger.info("Test route accessed"); // Example Winston log
  res.send("Hello from my API!");
});

router.get("/send-test-email", async (req, res) => {
  try {
    await emailService.sendEmail("zettler.jj@ilytat.com", "Test Email", "This is a test email from your API!");
    res.send("Test email sent successfully");
  } catch (error) {
    res.status(500).send("Error sending test email");
  }
});

module.exports = router;


