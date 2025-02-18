const express = require('express');
const router = express.Router();
const { createResourceRouter } = require('../../utils/routeFactory');
const authController = require('../../.controllers/authController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define auth-specific routes
const authRoutes = {
    // Authentication
    login: { 
        method: 'post', 
        path: '/login',
        description: 'User login'
    },
    register: { 
        method: 'post', 
        path: '/register',
        description: 'User registration'
    },
    refreshToken: { 
        method: 'post', 
        path: '/refresh-token',
        description: 'Refresh access token'
    },
    logout: { 
        method: 'post', 
        path: '/logout',
        middleware: [authenticateToken],
        description: 'User logout'
    },

    // Password Management
    requestPasswordReset: { 
        method: 'post', 
        path: '/request-reset',
        description: 'Request password reset email'
    },
    resetPassword: { 
        method: 'post', 
        path: '/reset-password',
        description: 'Reset password with token'
    },
    validateResetToken: { 
        method: 'get', 
        path: '/validate-reset-token',
        description: 'Validate password reset token'
    },

    // Email Verification
    verifyEmail: { 
        method: 'get', 
        path: '/verify-email/:token',
        description: 'Verify email with token'
    },
    resendVerification: { 
        method: 'post', 
        path: '/resend-verification',
        middleware: [authenticateToken],
        description: 'Resend verification email'
    }
};

// Create and configure the router without standard CRUD routes
const authRouter = createResourceRouter({
    controller: authController,
    basePath: '/auth',
    routes: authRoutes,
    includeStandardRoutes: false // Explicitly exclude standard CRUD routes
});

router.use('/auth', authRouter);

module.exports = router;
