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
    references: {
      model: Task,
      key: "id"
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
  tableName: 'reminders'
});

module.exports = TaskReminder;
