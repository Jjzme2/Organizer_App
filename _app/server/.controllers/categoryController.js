const Category = require("../models/Category");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    logger.error('Error in getAllCategories:', error);
    throw new AppError("Failed to get categories", 500, "CATEGORY_FETCH_ERROR");
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const { name, color } = req.body;

    if (!name) {
      throw new AppError("Category name is required", 400, "VALIDATION_ERROR");
    }

    const category = await Category.create({
      name,
      color: color || '#808080'
    });

    res.status(201).json(category);
  } catch (error) {
    logger.error('Error in createCategory:', error);
    throw new AppError("Failed to create category", 500, "CATEGORY_CREATE_ERROR");
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const { name, color } = req.body;
    await category.update({ name, color });

    res.json(category);
  } catch (error) {
    logger.error('Error in updateCategory:', error);
    throw new AppError("Failed to update category", 500, "CATEGORY_UPDATE_ERROR");
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const category = await Category.findByPk(req.params.id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error('Error in deleteCategory:', error);
    throw new AppError("Failed to delete category", 500, "CATEGORY_DELETE_ERROR");
  }
};
