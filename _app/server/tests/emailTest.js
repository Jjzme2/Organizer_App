const emailService = require('../services/emailService');
const logger = require('../utils/logger');

async function testEmail() {
  try {
    await emailService.initialize();

    const html = `
      <h2>Test Email</h2>
      <p>This is a test email from your application.</p>
      <p>If you're receiving this, the email service is working correctly!</p>
    `;

    await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      'Test Email from Application',
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