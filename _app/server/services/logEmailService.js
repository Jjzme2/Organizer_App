 const schedule = require('node-schedule');
const fs = require('fs').promises;
const path = require('path');
const emailService = require('./emailService');
const logger = require('../utils/logger');
const fileUtility = require('../utils/fileUtility');

class LogEmailService {
  constructor() {
    this.scheduleDailyLogEmail();
  }

  async scheduleDailyLogEmail() {
    // Schedule to run daily at midnight
    schedule.scheduleJob('0 0 * * *', async () => {
      try {
        await this.sendDailyLogs();
      } catch (error) {
        logger.error('Error sending daily logs:', error);
      }
    });
  }

  async sendDailyLogs() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      const logsDir = path.join(__dirname, '../_logs', dateStr);

      // Check if directory exists
      if (!await fileUtility.fileExists(logsDir)) {
        logger.info(`No logs found for ${dateStr}`);
        return;
      }

      // Get all log files
      const files = await fs.readdir(logsDir);
      const attachments = files.map(file => ({
        filename: file,
        path: path.join(logsDir, file)
      }));

      const html = `
        <h2>Daily Application Logs - ${dateStr}</h2>
        <p>Attached are the application logs for ${dateStr}.</p>
        <ul>
          ${files.map(file => `<li>${file}</li>`).join('\n')}
        </ul>
      `;

      await emailService.sendEmail(
        process.env.ADMIN_EMAIL,
        `Application Logs - ${dateStr}`,
        html,
        attachments
      );

      logger.info(`Daily logs for ${dateStr} sent successfully`);
    } catch (error) {
      logger.error('Error sending daily logs:', error);
      throw error;
    }
  }
}

module.exports = new LogEmailService();