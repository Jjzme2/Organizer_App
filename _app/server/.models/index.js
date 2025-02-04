const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');
const TaskReminder = require('./TaskReminder');
const Role = require('./Role');

// User and Role association
User.belongsTo(Role, {
    foreignKey: 'roleId'
});

Role.hasMany(User, {
  foreignKey: "roleId",
});

// User and Task association
Task.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(Task, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Category and Task association
Task.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

Category.hasMany(Task, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

// Task and TaskReminder association
TaskReminder.belongsTo(Task, {
    foreignKey: {
        name: 'fk_reminder_task',
        field: 'taskId'
    }
});

Task.hasMany(TaskReminder, {
    onDelete: 'CASCADE'
});

module.exports = {
    User,
    Task,
    Category,
    TaskReminder,
    Role
};
