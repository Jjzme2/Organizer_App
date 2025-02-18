const { createResourceRouter } = require('../../utils/routeFactory');
const jottingController = require('../../.controllers/jottingController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes specific to jottings
const customRoutes = {
    getPinned: { 
        method: 'get', 
        path: '/pinned'
    },
    getArchived: { 
        method: 'get', 
        path: '/archived'
    },
    getFavorites: { 
        method: 'get', 
        path: '/favorites'
    },
    getByTag: { 
        method: 'get', 
        path: '/tag/:tag'
    },
    togglePin: { 
        method: 'patch', 
        path: '/:id/toggle-pin'
    },
    toggleArchive: { 
        method: 'patch', 
        path: '/:id/toggle-archive'
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
    controller: jottingController,
    basePath: '/jottings',
    routes: customRoutes,
    middleware: [authenticateToken]
});

module.exports = router;