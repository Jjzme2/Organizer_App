const Task = require("../.models/Task"); // Import your Sequelize model

/*
  ---------------------------------------------------------------
  | GETTERS |
  --------------------------------------------------------------- 
*/

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Task.list();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${Task.name}s`, message: error.message });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await Task.get(itemId);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${Task.name}`, message: error.message });
  }
};

// Get items by activity
exports.getItemsByActivity = (activity) => async (req, res) => {
  try {
    const items = await Task.listByActivity(activity);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${Task.name}s`, message: error.message });
  }
};

// Get items by completion
exports.getItemsByCompletion = (completion) => async (req, res) => {
  try {
    const items = await Task.listByCompletion(completion);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch ${Task.name}s`, message: error.message });
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