const express = require('express');
const { createResourceRouter } = require('../../utils/routeFactory');
const { articleCommentController, jottingCommentController } = require('../../.controllers/base/commentController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes for comments (shared between article and jotting comments)
const createCommentRoutes = (type) => ({
    getByParentId: { 
        method: 'get', 
        path: `/${type}/:parentId`,
        handler: 'getAll'
    },
    getRecent: { 
        method: 'get', 
        path: `/${type}/recent`,
        handler: 'getRecent'
    },
    getReplies: { 
        method: 'get', 
        path: `/${type}/:parentId/replies`,
        handler: 'getReplies'
    },
    addReply: { 
        method: 'post', 
        path: `/${type}/:parentId/replies`,
        handler: 'addReply'
    },
    toggleLike: { 
        method: 'patch', 
        path: `/${type}/:id/toggle-like`,
        handler: 'toggleLike'
    },
    toggleFlag: { 
        method: 'patch', 
        path: `/${type}/:id/toggle-flag`,
        handler: 'toggleFlag'
    },
    updateStatus: { 
        method: 'patch', 
        path: `/${type}/:id/status`,
        handler: 'updateStatus'
    }
});

// Create router
const router = express.Router();

// Create article comments router
const articleCommentsRouter = createResourceRouter({
    controller: articleCommentController,
    basePath: '/articles',
    routes: createCommentRoutes('articles'),
    middleware: [authenticateToken]
});

// Create jotting comments router
const jottingCommentsRouter = createResourceRouter({
    controller: jottingCommentController,
    basePath: '/jottings',
    routes: createCommentRoutes('jottings'),
    middleware: [authenticateToken]
});

// Mount the routers
router.use('/articles', articleCommentsRouter);
router.use('/jottings', jottingCommentsRouter);

module.exports = router;
