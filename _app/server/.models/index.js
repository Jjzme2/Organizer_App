const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');
const TaskReminder = require('./TaskReminder');
const Role = require('./Role');

// User and Role association
User.belongsTo(Role, {
    foreignKey: {
        name: 'fk_user_role',
        field: 'roleId'
    }
});

Role.hasMany(User);

// User and Task association
Task.belongsTo(User, {
    foreignKey: {
        name: 'fk_task_user',
        field: 'userId',
        type: 'UUID',
        allowNull: false
    },
});

User.hasMany(Task, {
    onDelete: 'CASCADE'
});

// Category and Task association
Task.belongsTo(Category, {
    foreignKey: {
        name: 'fk_task_category',
        field: 'categoryId'
    }
});

Category.hasMany(Task, {
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
