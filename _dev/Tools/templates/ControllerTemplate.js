/**
 * Model Controller Template
 *
 * How to use:
 * 1. Create a new controller file (e.g., 'userController.js', 'productController.js') in your 'controllers' directory.
 * 2. Copy the contents of this template into your new controller file.
 * 3. Update the model name: Replace 'YourModel' with the actual name of your model (e.g., 'User', 'Product').
 * 4. Update `allowedKeys` in `getAllItems` with the fields allowed for filtering on that model.
 * 5. Add controller methods: Add more controller methods as needed (e.g., create, update, delete, getById).
 */

const { Op } = require("sequelize");
const YourModel = require("../.models/YourModel"); // Import your Sequelize model

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
      "name",
      "isActive",
      "createdAt",
      "updatedAt" /* Add other allowed fields for YourModel */,
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

    const items = await YourModel.findAll({
      where: whereClause,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch ${YourModel.name}s`,
      message: error.message,
      stack: error.stack,
    });
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
    const newItem = await YourModel.create(itemData);
    res.status(201).json(newItem); // 201 Created
  } catch (error) {
    res.status(500).json({ error: `Failed to create ${YourModel.name}`, message: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const itemData = req.body;
  try {
    const updatedItem = await YourModel.update(itemId, itemData);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${YourModel.name}`, message: error.message });
  }
};
