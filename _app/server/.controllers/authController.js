const User = require("../models/User");
const authUtility = require("../utils/auth");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const emailService = require("../services/emailService");

// In production, use Redis or a database table for refresh tokens
const refreshTokens = new Map(); // Store user ID -> Set of refresh tokens

const revokeAllUserTokens = (userId) => {
    refreshTokens.delete(userId);
};

const isRefreshTokenValid = (userId, token) => {
    const userTokens = refreshTokens.get(userId);
    return userTokens && userTokens.has(token);
};

const addRefreshToken = (userId, token) => {
    if (!refreshTokens.has(userId)) {
        refreshTokens.set(userId, new Set());
    }
    refreshTokens.get(userId).add(token);

    // Limit number of refresh tokens per user
    const maxTokensPerUser = 5;
    const userTokens = refreshTokens.get(userId);
    if (userTokens.size > maxTokensPerUser) {
        // Remove oldest token (first in set)
        const oldestToken = userTokens.values().next().value;
        userTokens.delete(oldestToken);
    }
};

const removeRefreshToken = (userId, token) => {
    const userTokens = refreshTokens.get(userId);
    if (userTokens) {
        userTokens.delete(token);
        if (userTokens.size === 0) {
            refreshTokens.delete(userId);
        }
    }
};

const handleAuthError = (error, res, customMessage) => {
  logger.error(`${customMessage}:`, error);
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ error: message });
};

exports.register = async (req, res) => {
    const { fName, lName, username, email, password } = req.body;

	logger.debug('Registering user:', req.body);

    try {
        // Input validation
        if (!email || !password || !username || !fName || !lName) {
            return res.status(400).json({ error: "All fields are required", email: email, password: password, username: username, fname: fName, lname: lName });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // Check if user already exists
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.createUser({
			firstName: fName,
			lastName: lName,
            username,
            email,
			lastLogin: new Date(),
            passwordHash: hashedPassword,
            tokenVersion: 0
        });

		console.log('User created:', user);

        // Generate tokens
        const accessToken = authUtility.generateToken(user);
        const refreshToken = authUtility.generateRefreshToken(user);

        // Store refresh token
        addRefreshToken(user.id, refreshToken);


        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
                username: user.username,
                email: user.email,
				lastLogin: user.lastLogin
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: "Failed to register user", message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials: email" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials: password" });
        }

        // Generate tokens
        const accessToken = authUtility.generateToken(user);
        const refreshToken = authUtility.generateRefreshToken(user);

        // Store refresh token
        addRefreshToken(user.id, refreshToken);

		// Update last login date
		await user.update({ lastLogin: new Date() });

        res.json({
            user: {
                id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
                username: user.username,
                email: user.email,
				lastLogin: user.lastLogin
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: "Failed to login", message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findByPk(req.user.id);

      const validPassword = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!validPassword) {
        return res.status(401).json({
          error: 'Current password is incorrect'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await user.update({
        passwordHash: hashedPassword,
        tokenVersion: user.tokenVersion + 1 // Invalidate old tokens
      });

      res.json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      logger.error('Password update error:', error);
      res.status(500).json({
        error: 'Failed to update password'
      });
    }
  };

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" });
        }

        // Verify the refresh token
        const decoded = authUtility.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Check if token is in our storage
        if (!isRefreshTokenValid(decoded.id, refreshToken)) {
            return res.status(401).json({ error: "Refresh token has been revoked" });
        }

        // Get user
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Check token version
        if (decoded.tokenVersion !== user.tokenVersion) {
            removeRefreshToken(user.id, refreshToken);
            return res.status(401).json({ error: "Token has been revoked" });
        }

        // Generate new tokens
        const newAccessToken = authUtility.generateToken(user);
        const newRefreshToken = authUtility.generateRefreshToken(user);

        // Replace old refresh token
        removeRefreshToken(user.id, refreshToken);
        addRefreshToken(user.id, newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        logger.error('Token refresh error:', error);
        res.status(500).json({ error: "Failed to refresh token" });
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (refreshToken) {
            const decoded = authUtility.verifyRefreshToken(refreshToken);
            if (decoded) {
                removeRefreshToken(decoded.id, refreshToken);
            }
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({ error: "Failed to logout" });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        logger.error('Get current user error:', error);
        res.status(500).json({ error: "Failed to get user information" });
    }
};

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Validate environment variables
        if (!process.env.CLIENT_URL || !process.env.RESET_TOKEN_SECRET || !process.env.SENDGRID_RESET_TEMPLATE_ID) {
            throw new Error('Required environment variables are missing');
        }

        const user = await User.getByEmail(email);

        // Always return success to prevent email enumeration
        const response = {
            message: 'If an account exists with this email, you will receive reset instructions.'
        };

        if (!user) {
            logger.info('Password reset requested for non-existent email:', email);
            return res.json(response);
        }

        const resetToken = authUtility.generateResetToken(user.id);
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await emailService.sendTemplate(
            email,
            process.env.SENDGRID_RESET_TEMPLATE_ID,
            {
                username: user.username || user.firstName || 'User',
                resetUrl: resetUrl,
                appName: process.env.APP_NAME || 'Task Manager',
                expiryTime: '1 hour',
                year: new Date().getFullYear()
            }
        );

        res.json(response);
    } catch (error) {
        logger.error('Password reset request failed:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = authUtility.verifyResetToken(token);
    if (!decoded) {
      return res.status(400).json({
        error: 'Invalid or expired reset token'
      });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({
      passwordHash: hashedPassword,
      tokenVersion: user.tokenVersion + 1 // Invalidate old tokens
    });

    res.json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({
      error: 'Failed to reset password'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = authUtility.verifyEmailToken(token);
    if (!decoded) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ emailVerified: true });
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    const verificationToken = authUtility.generateEmailToken(user.id);
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await emailService.sendTemplate(
      user.email,
      process.env.SENDGRID_VERIFICATION_TEMPLATE_ID,
      {
        username: user.username || user.firstName || 'User',
        verificationUrl: verificationUrl,
        appName: process.env.APP_NAME || 'Task Manager',
        year: new Date().getFullYear()
      }
    );

    res.json({ message: 'Verification email has been resent' });
  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
};