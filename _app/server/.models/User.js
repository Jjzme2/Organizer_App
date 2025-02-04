const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Or your database config file
const logger = require("../utils/logger");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
    validate: {
      // Add validation rules for your model as needed
    },
  }
);

// Instance Method
User.prototype.setActive = function (isActive) {
  this.isActive = isActive;
  return this.save();
};

// Static methods
User.createUser = async function (userData) {
  try {
    const newUser = await this.create(userData);
    return newUser;
  } catch (error) {
    logger.error("Error creating user:", error);
    throw error;
  }
};

User.list = async function () {
  try {
    const items = await User.findAll();
    return items;
  } catch (error) {
    logger.error(`Error fetching ${this.name}s:`, error);
    throw error;
  }
};

User.get = async function (id) {
  try {
    const user = await this.findByPk(id);
    return user;
  } catch (error) {
    logger.error("Error finding user by id:", error);
    throw error;
  }
};

User.getByUsername = async function (username) {
  try {
    const item = await User.findOne({ where: { username } });
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    return item;
  } catch (error) {
    logger.error(`Error fetching ${this.name}:`, error);
    throw error;
  }
}

User.getByEmail = async function (email) {
  try {
    const user = await this.findOne({ where: { email } });
    return user;
  } catch (error) {
    logger.error("Error finding user by email:", error);
    throw error;
  }
}

User.listByActivity = async function (isActive) {
  try {
    const items = await User.findAll({ where: { isActive } });
    return items;
  } catch (error) {
    logger.error(`Error fetching ${this.name}s by activity:`, error);
    throw error;
  }
}

User.update = async function (itemId, itemData) {
  try {
    const item = await User.findByPk(itemId);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    await item.update(itemData);
    return item;
  } catch (error) {
    logger.error(`Error updating ${this.name}:`, error);
    throw error;
  }
};

module.exports = User;
