const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      const msg = {
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html,
        attachments
      };

      const info = await sgMail.send(msg);
      logger.info('Email sent successfully:', info[0].statusCode);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();