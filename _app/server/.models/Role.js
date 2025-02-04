const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const logger = require("../utils/logger");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: 'roles',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    modelName: 'Role'
  }
);

// Static methods
Role.createRole = async function (roleData) {
  try {
    const newRole = await this.create(roleData);
    return newRole;
  } catch (error) {
    logger.error("Error creating role:", error);
    throw error;
  }
};

Role.list = async function () {
  try {
    const items = await Role.findAll();
    return items;
  } catch (error) {
    logger.error(`Error fetching ${this.name}s:`, error);
    throw error;
  }
};

Role.get = async function (id) {
  try {
    const role = await this.findByPk(id);
    return role;
  } catch (error) {
    logger.error("Error finding role by id:", error);
    throw error;
  }
};

Role.getByName = async function (name) {
  try {
    const role = await this.findOne({ where: { name } });
    return role;
  } catch (error) {
    logger.error("Error finding role by name:", error);
    throw error;
  }
};

Role.update = async function (itemId, itemData) {
  try {
    const item = await Role.findByPk(itemId);
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

module.exports = Role;
