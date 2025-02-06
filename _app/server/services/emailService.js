const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    const requiredEnvVars = ['SENDGRID_API_KEY', 'EMAIL_FROM'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.from = process.env.EMAIL_FROM;
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      if (!this.isValidEmail(to)) {
        throw new Error('Invalid recipient email address');
      }

      const msg = {
        to,
        from: this.from,
        subject,
        html,
        attachments
      };

      const [response] = await sgMail.send(msg);
      logger.info('Email sent successfully', { to, statusCode: response.statusCode });
      return response;
    } catch (error) {
      logger.error('Failed to send email', { to, error: error.message });
      throw error;
    }
  }

  async sendTemplate(to, templateId, dynamicData = {}) {
    try {
      if (!this.isValidEmail(to)) {
        throw new Error('Invalid recipient email address');
      }

      const msg = {
        to,
        from: this.from,
        templateId,
        dynamicTemplateData: dynamicData
      };

      const [response] = await sgMail.send(msg);
      logger.info('Template email sent successfully', { to, templateId, statusCode: response.statusCode });
      return response;
    } catch (error) {
      logger.error('Failed to send template email', { to, templateId, error: error.message });
      throw error;
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

module.exports = new EmailService();