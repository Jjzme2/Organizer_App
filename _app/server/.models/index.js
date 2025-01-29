const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');
const TaskReminder = require('./TaskReminder');

// Define associations
User.hasMany(Task, {
    foreignKey: {
        name: 'userId',
        type: 'UUID',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        type: 'UUID',
        allowNull: false
    }
});

Task.belongsTo(Category, {
    foreignKey: 'categoryId'
});

Category.hasMany(Task, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE'
});

Task.hasMany(TaskReminder, {
    foreignKey: 'taskId',
    onDelete: 'CASCADE'
});
TaskReminder.belongsTo(Task, {
    foreignKey: 'taskId'
});

module.exports = {
    User,
    Task,
    Category,
    TaskReminder
};
