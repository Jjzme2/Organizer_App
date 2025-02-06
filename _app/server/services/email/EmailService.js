const sgMail = require('@sendgrid/mail');
const logger = require('../../utils/logger');
const templates = require('./templates');

class EmailService {
  constructor() {
    // Validate required environment variables
    const requiredEnvVars = [
      'SENDGRID_API_KEY',
      'EMAIL_FROM'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      logger.error('Missing required environment variables:', missingVars);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.from = process.env.EMAIL_FROM;
  }

  async send({ to, subject, html, template = 'default', context = {} }) {
    try {
      logger.info('Attempting to send email', { to, template });

      // Basic email validation
      if (!to || !this.isValidEmail(to)) {
        throw new Error('Invalid recipient email address');
      }

      const msg = {
        to,
        from: this.from,
        subject: subject || 'No Subject',
        html: html || this.getDefaultTemplate(context)
      };

      const [response] = await sgMail.send(msg);

      logger.info('Email sent successfully', {
        to,
        template,
        statusCode: response.statusCode
      });

      return response;
    } catch (error) {
      logger.error('Failed to send email', {
        to,
        template,
        error: error.message,
        stack: error.stack
      });
      throw new Error('Failed to send email: ' + error.message);
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getDefaultTemplate(context) {
    return `
      <div style="font-family: Arial, sans-serif;">
        <p>${context.message || 'No message provided'}</p>
      </div>
    `;
  }
}

module.exports = new EmailService();