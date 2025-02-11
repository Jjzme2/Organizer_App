const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Jotting = sequelize.define("Jotting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('tags');
      if (!rawValue) return [];
      return rawValue.split(',').map(tag => tag.trim());
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', value.join(','));
      } else if (typeof value === 'string') {
        this.setDataValue('tags', value);
      } else {
        this.setDataValue('tags', '');
      }
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
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
  tableName: 'jottings',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      name: 'idx_user_jottings',
      fields: ['userId']
    },
    {
      name: 'idx_public_jottings',
      fields: ['isPublic']
    }
  ]
});

// Add the association to the User model
Jotting.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = Jotting;