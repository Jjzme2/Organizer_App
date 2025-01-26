const User = require('./User');
const Task = require('./Task');

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

module.exports = {
    User,
    Task
};
