const User = require('./User');
const Role = require('./Role');
const Task = require('./Task');
const Category = require('./Category');

// User and Role associations
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// User and Task associations
Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

// Task and Category associations
Task.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Task, { foreignKey: 'categoryId' });

module.exports = {
  User,
  Role,
  Task,
  Category
};
