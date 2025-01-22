const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    validate: {
      titleLength() {
        if (this.title.length < 3) {
          throw new Error("Title must be at least 3 characters long.");
        }
      },
    },
  }
);

// Instance Method
Task.prototype.setActive = function (isActive) {
  this.isActive = isActive;
  return this.save();
};

// Class Methods
Task.list = async function () {
  try {
    const tasks = await Task.findAll();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

Task.get = async function (taskId) {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}

Task.listByActivity = async function (isActive) {
  try {
    const tasks = await Task.findAll({ where: { isActive } });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks by activity:", error);
    throw error;
  }
}

Task.listByCompletion = async function (completed) {
  try {
    const tasks = await Task.findAll({ where: { completed } });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks by completion:", error);
    throw error;
  }
}

Task.create = async function (taskData) {
  try {
    const newTask = await Task.create(taskData);
    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

Task.update = async function (taskId, taskData) {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await task.update(taskData);
    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

module.exports = Task;
