const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');

// Import route modules
const tasksRouter = require('./tasks');
const articlesRouter = require('./articles');
const quotesRouter = require('./quotes');
const jottingsRouter = require('./jottings');
const categoriesRouter = require('./categories');
const usersRouter = require('./users');
const commentsRouter = require('./comments');

// Apply authentication middleware to all routes except auth routes
router.use((req, res, next) => {
    // Skip authentication for login and register routes
    if (req.path.startsWith('/auth/')) {
        return next();
    }
    authenticateToken(req, res, next);
});

// Mount routes
router.use('/tasks', tasksRouter);
router.use('/articles', articlesRouter);
router.use('/quotes', quotesRouter);
router.use('/jottings', jottingsRouter);
router.use('/categories', categoriesRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'INTERNAL_SERVER_ERROR'
        }
    });
});

module.exports = router;
