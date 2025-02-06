const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Quote = sequelize.define("Quote", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000] // Maximum length of 1000 characters
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Unknown'
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('motivation', 'success', 'wisdom', 'leadership', 'personal_growth'),
    defaultValue: 'motivation'
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
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
  tableName: 'quotes',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      name: 'idx_user_quotes',
      fields: ['userId']
    },
    {
      name: 'idx_favorite_quotes',
      fields: ['isFavorite']
    }
  ]
});

module.exports = Quote;