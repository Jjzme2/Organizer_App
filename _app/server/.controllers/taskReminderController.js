const { Op } = require("sequelize");
const TaskReminder = require("../models/TaskReminder");
const Task = require("../models/Task");
const logger = require("../utils/logger");

exports.getAllItems = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in getAllItems');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const reminders = await TaskReminder.findAll({
      include: [{
        model: Task,
        where: { userId: req.user.id },
        attributes: ['id', 'name']
      }],
      order: [['reminderTime', 'ASC']]
    });

    res.json(reminders);
  } catch (error) {
    logger.error('Error in getAllItems:', error);
    res.status(500).json({ error: "Failed to get reminders", message: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in getItemById');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const reminder = await TaskReminder.findOne({
      where: { id: req.params.id },
      include: [{
        model: Task,
        where: { userId: req.user.id },
        attributes: ['id', 'name']
      }]
    });

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json(reminder);
  } catch (error) {
    logger.error('Error in getItemById:', error);
    res.status(500).json({ error: "Failed to get reminder", message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in createItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Verify the task belongs to the user
    const task = await Task.findOne({
      where: {
        id: req.body.taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const reminder = await TaskReminder.create(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    logger.error('Error in createItem:', error);
    res.status(500).json({ error: "Failed to create reminder", message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in updateItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const reminder = await TaskReminder.findOne({
      where: { id: req.params.id },
      include: [{
        model: Task,
        where: { userId: req.user.id }
      }]
    });

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    await reminder.update(req.body);
    res.json(reminder);
  } catch (error) {
    logger.error('Error in updateItem:', error);
    res.status(500).json({ error: "Failed to update reminder", message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in deleteItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const reminder = await TaskReminder.findOne({
      where: { id: req.params.id },
      include: [{
        model: Task,
        where: { userId: req.user.id }
      }]
    });

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    await reminder.destroy();
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteItem:', error);
    res.status(500).json({ error: "Failed to delete reminder", message: error.message });
  }
};