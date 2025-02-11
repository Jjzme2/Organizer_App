const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Jotting = require("./Jotting");

const JottingComment = sequelize.define("JottingComment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000] // Maximum length of 1000 characters
    }
  },
  jottingId: {
    type: DataTypes.UUID,
    references: {
      model: 'jottings',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
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
  tableName: 'jotting_comments',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      name: 'idx_jotting_comments_jotting',
      fields: ['jottingId']
    },
    {
      name: 'idx_jotting_comments_user',
      fields: ['userId']
    }
  ]
});

// Add associations
JottingComment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

JottingComment.belongsTo(Jotting, {
  foreignKey: 'jottingId',
  onDelete: 'CASCADE'
});

module.exports = JottingComment;