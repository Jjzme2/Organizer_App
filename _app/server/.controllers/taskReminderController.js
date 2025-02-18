const { Op } = require("sequelize");
const TaskReminder = require("../models/TaskReminder");
const Task = require("../models/Task");
const BaseController = require("./base/baseController");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

class TaskReminderController extends BaseController {
  constructor() {
    super(TaskReminder, "TaskReminder", {
      searchFields: ['notes'],
      includes: [{
        model: Task,
        attributes: ['id', 'title', 'description', 'dueDate']
      }],
      toggleFields: {
        isAcknowledged: true,
        isRecurring: true
      }
    });
  }

  // Override getAll to include task information
  getAll = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const reminders = await this.model.findAll({
        include: [{
          model: Task,
          where: { userId: req.user.id },
          attributes: ['id', 'name', 'dueDate', 'priority']
        }],
        order: [['reminderTime', 'ASC']]
      });

      res.json(reminders);
    } catch (error) {
      this.logger.error('Error in getAll reminders:', error);
      throw new AppError("Failed to get reminders", 500, "REMINDER_FETCH_ERROR");
    }
  };

  // Override getById to include task information
  getById = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const reminder = await this.model.findOne({
        where: { id: req.params.id },
        include: [{
          model: Task,
          where: { userId: req.user.id },
          attributes: ['id', 'name', 'dueDate', 'priority']
        }]
      });

      if (!reminder) {
        throw new NotFoundError("Reminder not found");
      }

      res.json(reminder);
    } catch (error) {
      this.logger.error('Error in getById reminder:', error);
      throw new AppError("Failed to get reminder", 500, "REMINDER_FETCH_ERROR");
    }
  };

  // Get upcoming reminders
  getUpcoming = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const { hours = 24, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const endTime = new Date();
      endTime.setHours(endTime.getHours() + parseInt(hours));

      const { rows: reminders, count } = await this.model.findAndCountAll({
        where: {
          userId: req.user.id,
          isAcknowledged: false,
          reminderTime: {
            [Op.between]: [new Date(), endTime]
          }
        },
        order: [['reminderTime', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: this.options.includes
      });

      res.json({
        items: reminders,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      this.logger.error('Error in getUpcoming:', error);
      throw new AppError("Failed to get upcoming reminders", 500, "REMINDER_FETCH_ERROR");
    }
  };

  // Get overdue reminders
  getOverdue = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { rows: reminders, count } = await this.model.findAndCountAll({
        where: {
          userId: req.user.id,
          isAcknowledged: false,
          reminderTime: {
            [Op.lt]: new Date()
          }
        },
        order: [['reminderTime', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: this.options.includes
      });

      res.json({
        items: reminders,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      this.logger.error('Error in getOverdue:', error);
      throw new AppError("Failed to get overdue reminders", 500, "REMINDER_FETCH_ERROR");
    }
  };

  // Get recurring reminders
  getRecurring = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { rows: reminders, count } = await this.model.findAndCountAll({
        where: {
          userId: req.user.id,
          isRecurring: true
        },
        order: [['reminderTime', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: this.options.includes
      });

      res.json({
        items: reminders,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      this.logger.error('Error in getRecurring:', error);
      throw new AppError("Failed to get recurring reminders", 500, "REMINDER_FETCH_ERROR");
    }
  };

  // Get reminder statistics
  getStats = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const stats = await this.model.findAll({
        where: { userId: req.user.id },
        attributes: [
          'isAcknowledged',
          'isRecurring',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['isAcknowledged', 'isRecurring']
      });

      const overdueCount = await this.model.count({
        where: {
          userId: req.user.id,
          isAcknowledged: false,
          reminderTime: {
            [Op.lt]: new Date()
          }
        }
      });

      const upcomingCount = await this.model.count({
        where: {
          userId: req.user.id,
          isAcknowledged: false,
          reminderTime: {
            [Op.gt]: new Date()
          }
        }
      });

      res.json({
        stats,
        overdueCount,
        upcomingCount
      });
    } catch (error) {
      this.logger.error('Error in getStats:', error);
      throw new AppError("Failed to get reminder statistics", 500, "REMINDER_STATS_ERROR");
    }
  };

  // Acknowledge a reminder
  acknowledgeReminder = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const reminder = await this.model.findOne({
        where: { id: req.params.id },
        include: [{
          model: Task,
          where: { userId: req.user.id }
        }]
      });

      if (!reminder) {
        throw new NotFoundError("Reminder not found");
      }

      reminder.acknowledged = true;
      reminder.acknowledgedAt = new Date();
      await reminder.save();

      res.json(reminder);
    } catch (error) {
      this.logger.error('Error in acknowledgeReminder:', error);
      throw new AppError("Failed to acknowledge reminder", 500, "REMINDER_UPDATE_ERROR");
    }
  };
}

module.exports = new TaskReminderController();