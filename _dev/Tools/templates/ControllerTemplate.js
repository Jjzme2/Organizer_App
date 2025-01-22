/**
 * Model Controller Template
 *
 * How to use:
 * 1. Create a new controller file (e.g., 'userController.js', 'productController.js') in your 'controllers' directory.
 * 2. Copy the contents of this template into your new controller file.
 * 3. Update the model name: Replace 'YourModel' with the actual name of your model (e.g., 'User', 'Product').
 * 4. Add controller methods: Add more controller methods as needed (e.g., create, update, delete, getById).
 */

const YourModel = require("../.models/YourModel"); // Import your Sequelize model

/*
  ---------------------------------------------------------------
  | GETTERS |
  ---------------------------------------------------------------
*/

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await YourModel.list();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${YourModel.name}s`, message: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await YourModel.get(itemId);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${YourModel.name}`, message: error.message });
  }
};

// Get items by activity
exports.getItemsByActivity = (activity) => async (req, res) => {
  try {
    const items = await YourModel.listByActivity(activity);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${YourModel.name}s`, message: error.message });
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

// ... add other controller methods as needed ...
