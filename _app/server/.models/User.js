const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Or your database config file

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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
  },
  {
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

// Class Methods
User.list = async function () {
  try {
    const items = await User.findAll();
    return items;
  } catch (error) {
    console.error(`Error fetching ${this.name}s:`, error);
    throw error;
  }
};

User.get = async function (itemId) {
  try {
    const item = await User.findByPk(itemId);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    return item;
  } catch (error) {
    console.error(`Error fetching ${this.name}:`, error);
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
    console.error(`Error fetching ${this.name}:`, error);
    throw error;
  }
}

User.getByEmail = async function (email) {
  try {
    const item = await User.findOne({ where: { email } });
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    return item;
  } catch (error) {
    console.error(`Error fetching ${this.name}:`, error);
    throw error;
  }
}

User.listByActivity = async function (isActive) {
  try {
    const items = await User.findAll({ where: { isActive } });
    return items;
  } catch (error) {
    console.error(`Error fetching ${this.name}s by activity:`, error);
    throw error;
  }
}

User.create = async function (itemData) {
  try {
    const newItem = await User.create(itemData);
    return newItem;
  } catch (error) {
    console.error(`Error creating ${this.name}:`, error);
    throw error;
  }
};

User.update = async function (itemId, itemData) {
  try {
    const item = await User.findByPk(itemId);
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

module.exports = User;
