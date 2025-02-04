const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Task = require("./Task");

const TaskReminder = sequelize.define("TaskReminder", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.UUID,
    field: 'taskId',
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  reminderTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  tableName: 'reminders',
  freezeTableName: true,
  timestamps: true,
  modelName: 'TaskReminder'
});

module.exports = TaskReminder;
