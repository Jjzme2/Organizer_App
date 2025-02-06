const schedule = require('node-schedule');
const { Op } = require('sequelize');
const TaskReminder = require('../models/TaskReminder');
const Task = require('../models/Task');
const User = require('../models/User');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class TaskReminderService {
  constructor() {
    this.checkReminders();
    logger.info('Task reminder service initialized');
  }

  async checkReminders() {
    // Check every minute
    schedule.scheduleJob('* * * * *', async () => {
      try {
        const now = new Date();
        const reminders = await TaskReminder.findAll({
          where: {
            reminderTime: {
              [Op.lte]: now,
              [Op.gte]: new Date(now.getTime() - 5 * 60 * 1000) // Only get reminders from last 5 minutes
            },
            isSent: false
          },
          include: [{
            model: Task,
            include: [User]
          }]
        });

        logger.info(`Found ${reminders.length} pending reminders`);

        for (const reminder of reminders) {
          try {
            await this.sendReminderEmail(reminder);
            await reminder.update({ isSent: true });
            logger.info(`Sent reminder for task: ${reminder.Task.name}`);
          } catch (error) {
            logger.error(`Error processing reminder ${reminder.id}:`, error);
          }
        }
      } catch (error) {
        logger.error('Error checking reminders:', error);
      }
    });
  }

  async sendReminderEmail(reminder) {
    const task = reminder.Task;
    const user = task.User;

    const html = `
      <h2>Task Reminder: ${task.name}</h2>
      <p>This is a reminder for your task due ${task.dueDate ? `on ${new Date(task.dueDate).toLocaleString()}` : 'soon'}.</p>
      <h3>Task Details:</h3>
      <ul>
        <li><strong>Description:</strong> ${task.description || 'No description'}</li>
        <li><strong>Priority:</strong> ${task.priority}</li>
        <li><strong>Status:</strong> ${task.status}</li>
      </ul>
      <p>Click <a href="${process.env.CLIENT_URL}/tasks/${task.id}">here</a> to view your task.</p>
    `;

    try {
      await emailService.sendEmail(
        user.email,
        `Reminder: ${task.name}`,
        html
      );
    } catch (error) {
      logger.error(`Failed to send reminder email for task ${task.id}:`, error);
      throw error;
    }
  }
}

module.exports = new TaskReminderService();