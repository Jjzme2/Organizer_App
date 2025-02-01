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
const logger = require("../utils/logger");

const ModelTemplate = sequelize.define(
  "YourModelName",
  {
    // Replace 'YourModelName' with the actual model name (e.g., 'User', 'Product', etc.)
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },


    // ... other fields specific to your model ...
    // (e.g., name, email, price, description, etc.)
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

ModelTemplate.prototype.update = function (data) {
  Object.keys(data).forEach((key) => {
    this[key] = data[key];
  });
  return this.save();
};

module.exports = ModelTemplate;
