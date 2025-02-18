const { createResourceRouter } = require('../../utils/routeFactory');
const categoryController = require('../../.controllers/categoryController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes specific to categories
const customRoutes = {
    default: {
        method: 'get',
        path: '/',
        handler: (req, res, next) => categoryController.getUserCategories(req.user.id)
            .then(categories => res.json(categories))
            .catch(next)
    },
    getActive: { 
        method: 'get', 
        path: '/active'
    },
    getFeatured: { 
        method: 'get', 
        path: '/featured'
    },
    getStats: { 
        method: 'get', 
        path: '/stats'
    },
    toggleActive: { 
        method: 'patch', 
        path: '/:id/toggle-active'
    },
    toggleFeatured: { 
        method: 'patch', 
        path: '/:id/toggle-featured'
    },
    updateStatus: { 
        method: 'patch', 
        path: '/:id/status'
    }
};

// Create and configure the router
const router = createResourceRouter({
    controller: categoryController,
    basePath: '/categories',
    routes: customRoutes,
    middleware: [authenticateToken]
});

module.exports = router;
