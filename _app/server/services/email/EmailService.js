const sgMail = require('@sendgrid/mail');
const logger = require('../../utils/logger');
const templates = require('./templates');

class EmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is required');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.from = process.env.EMAIL_FROM;
  }

  async send({ to, template, context, attachments = [] }) {
    try {
      if (!templates[template]) {
        throw new Error(`Email template '${template}' not found`);
      }

      const { subject, html, text } = templates[template].generate(context);

      const msg = {
        to,
        from: this.from,
        subject,
        html,
        text, // Always include plain text version
        attachments
      };

      const [response] = await sgMail.send(msg);

      logger.info('Email sent successfully', {
        template,
        to,
        messageId: response.headers['x-message-id'],
        statusCode: response.statusCode
      });

      return response;
    } catch (error) {
      logger.error('Failed to send email', {
        template,
        to,
        error: error.message
      });
      throw new Error('Failed to send email');
    }
  }
}

module.exports = new EmailService();