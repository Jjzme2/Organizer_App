const { Op } = require("sequelize");
const Task = require("../.models/Task"); // Import your Sequelize model

/*
 ---------------------------------------------------------------
 | GETTERS |
 ---------------------------------------------------------------
*/

// Get all items with filtering
exports.getAllItems = async (req, res) => {
  try {
    if (!req || req == null) {
      throw new Error("Request object is null");
    }

    const whereClause = {};
    const allowedKeys = [
      "id",
      // "name", // -- Removed to potential issue with URL encoding
      "isComplete",
      "isActive",
      "createdAt",
      "updatedAt" /* Add other allowed fields for Task */,
    ];

    // Iterate over query parameters
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];

        // Check if the key is allowed for filtering
        const field = key.includes("[") ? key.split(/\[|\]/)[0] : key;
        if (!allowedKeys.includes(field)) {
          throw new Error(`Invalid filter parameter: ${key}`);
        }

        // Handle operators in query parameters (e.g., createdAt[gte])
        if (key.includes("[")) {
          const [field, operator] = key.split(/\[|\]/); // Extract field and operator
          whereClause[field] = whereClause[field] || {}; // Ensure nested object
          whereClause[field][Op[operator]] = value;
        } else {
          // Direct field matching
          whereClause[key] = value;
        }
      }
    }

    const items = await Task.findAll({
      where: whereClause,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch ${Task.name}s`,
      message: error.message,
      stack: error.stack,
    });
  }
};

// Get an item by its Name
exports.getItemByName = async (req, res) => {
  const itemName = req.params.name;

  console.log(`Fetching ${Task.name} with name: ${itemName}`);

  // ! Ensure that the task is only being pulled if its from the current user
  try {
    const item = await Task.findOne({ where: { name: itemName } });
    if (!item) {
      return res.status(404).json({ error: `${Task.name} not found` });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${Task.name}`, message: error.message });
  }
};

/* 
 ---------------------------------------------------------------
 | SETTERS |
 ---------------------------------------------------------------
*/

// Create a new item
exports.createItem = async (req, res) => {
  const itemData = req.body;
  try {
    const newItem = await Task.create(itemData);
    res.status(201).json(newItem); // 201 Created
  } catch (error) {
    res.status(500).json({ error: `Failed to create ${Task.name}`, message: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const itemData = req.body;
  try {
    const updatedItem = await Task.update(itemId, itemData);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${Task.name}`, message: error.message });
  }
};
