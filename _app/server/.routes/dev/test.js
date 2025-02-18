const express = require('express');
const logger = require("../../utils/logger");
const emailService = require('../../services/emailService');

const router = express.Router();

// Example route (replace with your actual API logic)
router.get("/announce", (req, res) => {
  logger.info("Test route accessed"); // Example Winston log
  
  const message = "Hello from my API!";
  const timeStamp = new Date().toISOString();
  if(req.body.user){
    const {name, email} = req.body.user;
  }
  
  res.json({ message, timeStamp });
});

router.get("/send-test-email", async (req, res) => {
  try {
    const messageBody = `
      <h2>Test Email</h2>
      <p>This is a test email from your application.</p>
      <p>If you're receiving this, SendGrid email service is working correctly!</p>
      <hr>
      <small>Sent at: ${new Date().toLocaleString()}</small>
    `;
    const response = await emailService.sendEmail(
      "zettler.jj@ilytat.com", 
      "Test Email", 
      messageBody
    );
    res.json({ success: true, message: "Test email sent successfully", response});
  } catch (error) {
    logger.error("Failed to send test email", {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.body || error.stack
    });
  }
});

module.exports = router;
