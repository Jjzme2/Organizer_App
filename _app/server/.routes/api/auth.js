const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');
const authController = require('../../.controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.put('/update-password', authenticateToken, authController.updatePassword);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
