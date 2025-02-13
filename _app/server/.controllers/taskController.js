const { Op } = require("sequelize");
const Task = require("../models/Task");
const Category = require("../models/Category");
const TaskReminder = require("../models/TaskReminder");
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

    logger.debug('Update task request:', {
      taskId: req.params.id,
      userId: req.user.id,
      body: req.body
    });

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    logger.debug('Found task to update:', {
      taskId: task.id,
      currentState: task.toJSON()
    });

    // Handle status update
    if (req.body.status) {
      task.status = req.body.status;
      if (req.body.status === 'completed') {
        task.completedAt = new Date();
        task.isComplete = true;
      } else {
        task.completedAt = null;
        task.isComplete = false;
      }
    }

    // Handle priority update
    if (req.body.priority) {
      task.priority = req.body.priority;
    }

    // Handle notes update
    if (req.body.notes) {
      if (Array.isArray(req.body.notes)) {
        task.notes = req.body.notes;
      } else if (typeof req.body.notes === 'string') {
        const currentNotes = task.notes || [];
        currentNotes.push(req.body.notes);
        task.notes = currentNotes;
      }
    }

    // Handle other updates
    if (req.body.name) task.name = req.body.name;
    if (req.body.description) task.description = req.body.description;
    if (req.body.dueDate) task.dueDate = req.body.dueDate;
    if (req.body.expectedDifficulty) task.expectedDifficulty = req.body.expectedDifficulty;
    if (req.body.categoryId) task.categoryId = req.body.categoryId;
    if (typeof req.body.isActive === 'boolean') task.isActive = req.body.isActive;

    await task.save();

    logger.debug('Task updated:', {
      taskId: task.id,
      newState: task.toJSON()
    });

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

    logger.debug('Sending updated task response:', {
      taskId: updatedTask.id,
      finalState: updatedTask.toJSON()
    });

    res.json(updatedTask);
  } catch (error) {
    logger.error('Error in updateItem:', error);
    throw new AppError("Failed to update task", 500, "TASK_UPDATE_ERROR");
  }
};

// Deactivate an item by ID
exports.deactivateItem = async (req, res) => {
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

    if (!task.isComplete) {
      throw new AppError("Only completed tasks can be deactivated", 400, "TASK_DEACTIVATE_ERROR");
    }

    const completedDate = new Date(task.completedAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (completedDate > oneWeekAgo) {
      throw new AppError(
        "Task must be completed for at least a week to be deactivated",
        400,
        "TASK_DEACTIVATE_ERROR"
      );
    }

    await task.update({
      isDeactivated: true,
      deactivatedAt: new Date(),
    });

    res.json(task);
  } catch (error) {
    logger.error("Error deactivating task:", error);
    if (error instanceof AppError || error instanceof AuthenticationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new AppError("Failed to deactivate task", 500, "TASK_DEACTIVATE_ERROR");
  }
};

exports.reactivateItem = async (req, res) => {
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

    if (!task.isDeactivated) {
      throw new AppError("Task is not deactivated", 400, "TASK_REACTIVATE_ERROR");
    }

    await task.update({
      isDeactivated: false,
      deactivatedAt: null,
    });

    res.json(task);
  } catch (error) {
    logger.error("Error reactivating task:", error);
    if (error instanceof AppError || error instanceof AuthenticationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new AppError("Failed to reactivate task", 500, "TASK_REACTIVATE_ERROR");
  }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const { id } = req.params;
    
    // Find the task
    const task = await Task.findOne({
      where: {
        id,
        userId: req.user.id // Ensure the task belongs to the user
      }
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Delete associated reminders first
    await TaskReminder.destroy({
      where: { taskId: id }
    });

    // Delete the task
    await task.destroy();

    logger.info(`Task ${id} deleted successfully`);
    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (error) {
    logger.error('Error deleting task:', error);
    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
};

module.exports = exports;