const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Article = require("./Article");

const ArticleComment = sequelize.define("ArticleComment", {
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
  parentId: {
    type: DataTypes.UUID,
    references: {
      model: 'articles',
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
  tableName: 'article_comments',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      name: 'idx_article_comments_article',
      fields: ['parentId']
    },
    {
      name: 'idx_article_comments_user',
      fields: ['userId']
    }
  ]
});

// Add associations
ArticleComment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

ArticleComment.belongsTo(Article, {
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});

module.exports = ArticleComment;