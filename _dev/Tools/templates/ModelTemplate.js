/**
 * Model Template for Sequelize
 *
 * How to use:
 * 1. Create a new model file (e.g., 'user.js', 'product.js') in your 'models' directory.
 * 2. Copy the contents of this template into your new model file.
 * 3. Update the model name: Replace 'YourModelName' with the actual name of your model.
 * 4. Add fields: Add the fields specific to your model.
 * 5. Add validation: Add validation rules as needed.
 * 6. Customize methods: Modify or add instance and class methods as required.
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Or your database config file

const ModelTemplate = sequelize.define(
  "YourModelName",
  {
    // Replace 'YourModelName' with the actual model name (e.g., 'User', 'Product', etc.)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ... other fields specific to your model ...
    // (e.g., name, email, price, description, etc.)
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    validate: {
      // Add validation rules for your model as needed
    },
  }
);

// Instance Method
ModelTemplate.prototype.setActive = function (isActive) {
  this.isActive = isActive;
  return this.save();
};

// Class Methods
ModelTemplate.list = async function () {
  try {
    const items = await ModelTemplate.findAll();
    return items;
  } catch (error) {
    console.error(`Error fetching ${this.name}s:`, error);
    throw error;
  }
};

ModelTemplate.get = async function (itemId) {
  try {
    const item = await ModelTemplate.findByPk(itemId);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    return item;
  } catch (error) {
    console.error(`Error fetching ${this.name}:`, error);
    throw error;
  }
};

ModelTemplate.getByActivity = async function (activity) {
  try {
    const items = await ModelTemplate.findAll({
      where: { isActive: activity },
    });
    return items;
  } catch (error) {
    console.error(`Error fetching ${this.name}s:`, error);
    throw error;
  }
}

ModelTemplate.create = async function (itemData) {
  try {
    const newItem = await ModelTemplate.create(itemData);
    return newItem;
  } catch (error) {
    console.error(`Error creating ${this.name}:`, error);
    throw error;
  }
};

ModelTemplate.update = async function (itemId, itemData) {
  try {
    const item = await ModelTemplate.findByPk(itemId);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    await item.update(itemData);
    return item;
  } catch (error) {
    console.error(`Error updating ${this.name}:`, error);
    throw error;
  }
};

module.exports = ModelTemplate;
