const User = require("../models/User"); // Import your Sequelize model

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await User.list();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${User.name}s`, message: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await User.get(itemId);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${User.name}`, message: error.message });
  }
};

// Create a new item
exports.createItem = async (req, res) => {
  const itemData = req.body;
  try {
    const newItem = await User.create(itemData);
    res.status(201).json(newItem); // 201 Created
  } catch (error) {
    res.status(500).json({ error: `Failed to create ${User.name}`, message: error.message });
  }
};

// Update an item by ID
exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const itemData = req.body;
  try {
    const updatedItem = await User.update(itemId, itemData);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: `Failed to update ${User.name}`, message: error.message });
  }
};

// ... add other controller methods as needed ...
