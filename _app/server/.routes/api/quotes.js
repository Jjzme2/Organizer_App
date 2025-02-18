const { createResourceRouter } = require('../../utils/routeFactory');
const quoteController = require('../../.controllers/quoteController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes specific to quotes
const customRoutes = {
    getRandom: { 
        method: 'get', 
        path: '/random'
    },
    getFavorites: { 
        method: 'get', 
        path: '/favorites'
    },
    getByAuthor: { 
        method: 'get', 
        path: '/author/:author'
    },
    getByTag: { 
        method: 'get', 
        path: '/tag/:tag'
    },
    toggleFavorite: { 
        method: 'patch', 
        path: '/:id/toggle-favorite'
    },
    updateStatus: { 
        method: 'patch', 
        path: '/:id/status'
    }
};

// Create and configure the router
const router = createResourceRouter({
    controller: quoteController,
    basePath: '/quotes',
    routes: customRoutes,
    middleware: [authenticateToken]
});

module.exports = router;