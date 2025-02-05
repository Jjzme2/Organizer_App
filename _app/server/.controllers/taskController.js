const { Op } = require("sequelize");
const Task = require("../.models/Task");
const Category = require("../.models/Category");
const TaskReminder = require("../.models/TaskReminder");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

/*
 ---------------------------------------------------------------
 | GETTERS |
 ---------------------------------------------------------------
*/

// Get all items with filtering
exports.getAllItems = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const whereClause = {
      userId: req.user.id // Only get tasks for the authenticated user
    };

    // Add any additional filters from query parameters
    const allowedKeys = [
      "isComplete",
      "isActive"
    ];

    for (const key of allowedKeys) {
      if (req.query[key] !== undefined) {
        whereClause[key] = req.query[key];
      }
    }

    logger.debug('Getting tasks with where clause:', whereClause);
    const items = await Task.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color']
      }]
    });

    res.json(items);
  } catch (error) {
    logger.error('Error in getAllItems:', error);
    throw new AppError("Failed to get tasks", 500, "TASK_FETCH_ERROR");
  }
};

// Get an item by its Name
exports.getItemByName = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const item = await Task.findOne({
      where: {
        name: req.params.name,
        userId: req.user.id
      },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color']
      }]
    });

    if (!item) {
      throw new NotFoundError("Task not found");
    }

    res.json(item);
  } catch (error) {
    logger.error('Error in getItemByName:', error);
    throw new AppError("Failed to get task", 500, "TASK_FETCH_ERROR");
  }
};

/*
 ---------------------------------------------------------------
 | SETTERS |
 ---------------------------------------------------------------
*/

// Create a new item
exports.createItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    // Start a transaction since we may need to create a reminder
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    // Create reminder if reminderTime is provided
    if (req.body.reminderTime) {
      await TaskReminder.create({
        taskId: task.id,
        reminderTime: new Date(req.body.reminderTime),
        isSent: false
      });
    }

    // Fetch the task with category data
    const taskWithCategory = await Task.findByPk(task.id, {
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color']
      }]
    });

    res.status(201).json(taskWithCategory);
  } catch (error) {
    logger.error('Error in createItem:', error);
    throw new AppError("Failed to create task", 500, "TASK_CREATE_ERROR");
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Start transaction for update with potential reminder changes
    await task.update(req.body);

    // Handle reminder updates
    if (req.body.reminderTime) {
      // Update or create reminder
      await TaskReminder.upsert({
        taskId: task.id,
        reminderTime: new Date(req.body.reminderTime),
        isSent: false
      }, {
        where: { taskId: task.id }
      });
    } else if (req.body.reminderTime === null) {
      // Remove reminder if explicitly set to null
      await TaskReminder.destroy({
        where: { taskId: task.id }
      });
    }

    // Fetch updated task with category data
    const updatedTask = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color']
      }]
    });

    res.json(updatedTask);
  } catch (error) {
    logger.error('Error in updateItem:', error);
    throw new AppError("Failed to update task", 500, "TASK_UPDATE_ERROR");
  }
};
