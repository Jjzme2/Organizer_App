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
router.post('/resend-verification', authenticateToken, authController.resendVerification);

// Password reset flow
router.post('/forgot-password', authController.requestPasswordReset);

router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/update-password', authenticateToken, authController.updatePassword);

// router.get('/google/callback', async (req, res) => {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GMAIL_CLIENT_ID,
//     process.env.GMAIL_CLIENT_SECRET,
//     process.env.GMAIL_REDIRECT_URI
//   );

//   try {
//     const { code } = req.query;
//     const { tokens } = await oauth2Client.getToken(code);
//     logger.info('Received new refresh token:', tokens.refresh_token);
//     res.send('Authentication successful! You can close this window.');
//   } catch (error) {
//     logger.error('OAuth callback error:', error);
//     res.status(500).send('Authentication failed');
//   }
// });

module.exports = router;
