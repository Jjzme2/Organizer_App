const express = require('express');
const { createResourceRouter } = require('../../utils/routeFactory');
const taskController = require('../../.controllers/taskController');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Define custom routes specific to tasks
const customRoutes = {
    // Task-specific routes
    getUpcoming: { 
        method: 'get', 
        path: '/upcoming'
    },
    getOverdue: { 
        method: 'get', 
        path: '/overdue'
    },
    toggle: { 
        method: 'patch', 
        path: '/:id/toggle'
    },
    updateStatus: { 
        method: 'patch', 
        path: '/:id/status'
    }
};

// Create and configure the router
const router = createResourceRouter({
    controller: taskController,
    basePath: '/tasks',
    routes: customRoutes,
    middleware: [authenticateToken]
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Task Route Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'UNKNOWN_ERROR'
  });
});

module.exports = router;
