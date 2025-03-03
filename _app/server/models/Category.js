const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#808080',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'categories',
  freezeTableName: true,
  timestamps: true,
  modelName: 'Category'
});

// Define association with User
Category.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Category, {
  foreignKey: 'userId',
  as: 'categories'
});

module.exports = Category;
