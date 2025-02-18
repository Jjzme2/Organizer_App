const express = require("express");
const router = express.Router();
const userController = require("../../.controllers/userController");
const { authenticateToken } = require("../../middleware/authMiddleware");
const { createRequestLogger } = require("../../middleware/loggingMiddleware");
const { createResourceRouter } = require('../../utils/routeFactory');

// Create request logger for users
const logRequest = createRequestLogger('User');

// Apply middleware
router.use(logRequest);

// Define custom routes specific to users
const customRoutes = {
    // Authentication routes (no auth required)
    register: { 
        method: 'post', 
        path: '/register'
    },
    login: { 
        method: 'post', 
        path: '/login'
    },
    requestPasswordReset: { 
        method: 'post', 
        path: '/request-reset'
    },
    resetPassword: { 
        method: 'post', 
        path: '/reset-password'
    },

    // Profile routes (auth required)
    getProfile: { 
        method: 'get', 
        path: '/profile'
    },
    updateProfile: { 
        method: 'put', 
        path: '/profile'
    },
    updatePassword: { 
        method: 'patch', 
        path: '/password'
    },
    
    // Preferences routes (auth required)
    getPreferences: { 
        method: 'get', 
        path: '/preferences'
    },
    updatePreferences: { 
        method: 'put', 
        path: '/preferences'
    },

    // Account management (auth required)
    deleteAccount: { 
        method: 'delete', 
        path: '/account'
    }
};

// Create router without default auth middleware
const usersRouter = createResourceRouter({
    controller: userController,
    basePath: '/users',
    routes: customRoutes
});

// Apply auth middleware to protected routes only
usersRouter.use((req, res, next) => {
    // Skip authentication for public routes
    const publicPaths = ['/register', '/login', '/request-reset', '/reset-password'];
    if (publicPaths.includes(req.path)) {
        return next();
    }
    authenticateToken(req, res, next);
});

// Public routes
router.post("/register", userController.register);

// Protected routes
router.use(authenticateToken);

// User management routes
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);

// Profile routes
router.use('/users', usersRouter);

module.exports = router;
