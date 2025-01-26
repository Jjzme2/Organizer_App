const User = require("../.models/User");
const authUtility = require("../utils/auth");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

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

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Input validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: "All fields are required" });
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
            name,
            email,
            password: hashedPassword,
            tokenVersion: 0
        });

        // Generate tokens
        const accessToken = authUtility.generateToken(user);
        const refreshToken = authUtility.generateRefreshToken(user);
        
        // Store refresh token
        addRefreshToken(user.id, refreshToken);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: "Failed to register user" });
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
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate tokens
        const accessToken = authUtility.generateToken(user);
        const refreshToken = authUtility.generateRefreshToken(user);

        // Store refresh token
        addRefreshToken(user.id, refreshToken);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: "Failed to login" });
    }
};

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      // Find the user by their email
      const user = await User.findOne({ where: { email: req.user.email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const validPassword = await bcrypt.compare(currentPassword, user.password);
  
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      await user.update({ password: hashedPassword });
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      logger.error('Error updating password:', error);
      res.status(500).json({ error: 'Failed to update password' });
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
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        logger.error('Get current user error:', error);
        res.status(500).json({ error: "Failed to get user information" });
    }
};