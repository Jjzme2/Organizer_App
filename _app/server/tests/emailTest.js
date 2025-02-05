const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const dotenv = require('dotenv');

dotenv.config();

async function testEmail() {
  try {
    const html = `
      <h2>Test Email</h2>
      <p>This is a test email from your application.</p>
      <p>If you're receiving this, SendGrid email service is working correctly!</p>
      <hr>
      <small>Sent at: ${new Date().toLocaleString()}</small>
    `;

    await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      'SendGrid Test Email',
      html
    );

    logger.info('Test email sent successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error sending test email:', error);
    process.exit(1);
  }
}

testEmail();