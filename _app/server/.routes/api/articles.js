const { createResourceRouter } = require('../../utils/routeFactory');
const articleController = require('../../.controllers/articleController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes specific to articles
const customRoutes = {
    getPublished: { 
        method: 'get', 
        path: '/published'
    },
    getFeatured: { 
        method: 'get', 
        path: '/featured'
    },
    getArchived: { 
        method: 'get', 
        path: '/archived'
    },
    togglePublish: { 
        method: 'patch', 
        path: '/:id/toggle-publish'
    },
    toggleFeature: { 
        method: 'patch', 
        path: '/:id/toggle-feature'
    },
    toggleArchive: { 
        method: 'patch', 
        path: '/:id/toggle-archive'
    },
    updateStatus: { 
        method: 'patch', 
        path: '/:id/status'
    }
};

// Create and configure the router
const router = createResourceRouter({
    controller: articleController,
    basePath: '/articles',
    routes: customRoutes,
    middleware: [authenticateToken]
});

module.exports = router;