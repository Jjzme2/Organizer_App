const User = require('./User');
const Task = require('./Task');
const Category = require('./Category');
const TaskReminder = require('./TaskReminder');
const Role = require('./Role');
const Quote = require('./Quote');
const Jotting = require('./Jotting');
const JottingComment = require('./JottingComment');
const Article = require('./Article');
const ArticleComment = require('./ArticleComment');

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
    foreignKey: 'taskId',
    onDelete: 'CASCADE'
});

Task.hasMany(TaskReminder, {
    foreignKey: 'taskId',
    onDelete: 'CASCADE'
});

// Quote and User association
Quote.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(Quote, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Jotting and User association
Jotting.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(Jotting, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// Article and User association
Article.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(Article, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

// JottingComment associations
JottingComment.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(JottingComment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

JottingComment.belongsTo(Jotting, {
    foreignKey: 'jottingId',
    onDelete: 'CASCADE'
});

Jotting.hasMany(JottingComment, {
    foreignKey: 'jottingId',
    onDelete: 'CASCADE'
});

// ArticleComment associations
ArticleComment.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(ArticleComment, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

ArticleComment.belongsTo(Article, {
    foreignKey: 'articleId',
    onDelete: 'CASCADE'
});

Article.hasMany(ArticleComment, {
    foreignKey: 'articleId',
    onDelete: 'CASCADE'
});

module.exports = {
    User,
    Task,
    Category,
    TaskReminder,
    Role,
    Quote,
    Jotting,
    JottingComment,
    Article,
    ArticleComment
};
