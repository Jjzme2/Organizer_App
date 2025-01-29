const { Op } = require("sequelize");
const Category = require("../.models/Category");
const logger = require("../utils/logger");

exports.getAllItems = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in getAllItems');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    logger.error('Error in getAllItems:', error);
    res.status(500).json({ error: "Failed to get categories", message: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in getItemById');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    logger.error('Error in getItemById:', error);
    res.status(500).json({ error: "Failed to get category", message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in createItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const category = await Category.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(category);
  } catch (error) {
    logger.error('Error in createItem:', error);
    res.status(500).json({ error: "Failed to create category", message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in updateItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    logger.error('Error in updateItem:', error);
    res.status(500).json({ error: "Failed to update category", message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated in deleteItem');
      return res.status(401).json({ error: "User not authenticated" });
    }

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteItem:', error);
    res.status(500).json({ error: "Failed to delete category", message: error.message });
  }
};