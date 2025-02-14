const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authMiddleware');
const authController = require('../../.controllers/authController');
// const { google } = require('googleapis');
const logger = require('../../utils/logger');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Email verification routes
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/send-verification', authenticateToken, authController.sendVerification);

// Password reset flow
router.post('/forgot-password', authController.requestPasswordReset);

router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/update-password', authenticateToken, authController.updatePassword);


module.exports = router;
