const { Op } = require("sequelize");
const Task = require("../.models/Task");
const logger = require("../utils/logger");

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
      logger.error('User not authenticated in getAllItems');
      return res.status(401).json({ error: "User not authenticated" });
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
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    logger.error('Error in getAllItems:', error);
    res.status(500).json({ error: "Failed to get tasks", message: error.message });
  }
};

// Get an item by its Name
exports.getItemByName = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in getItemByName');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const item = await Task.findOne({
      where: {
        name: req.params.name,
        userId: req.user.id
      }
    });

    if (!item) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(item);
  } catch (error) {
    logger.error('Error in getItemByName:', error);
    res.status(500).json({ error: "Failed to get task", message: error.message });
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
      logger.error('User not authenticated in createItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    logger.error('Error in createItem:', error);
    res.status(500).json({ error: "Failed to create task", message: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in updateItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    logger.error('Error in updateItem:', error);
    res.status(500).json({ error: "Failed to update task", message: error.message });
  }
};
