const BaseController = require('./base/baseController');
const { User, Category, Task, Article, Quote, Jotting } = require('../models');
const { ApiError } = require('../utils/errorUtils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class UserController extends BaseController {
    constructor() {
        super(User, 'User');
        this.defaultIncludes = [
            {
                model: Category,
                as: 'categories',
                attributes: ['id', 'name']
            }
        ];
        this.sensitiveFields = ['password', 'resetToken', 'resetTokenExpiry'];
    }

    /**
     * Register a new user
     * @param {Object} data - User registration data
     */
    async register(data) {
        const { email, password, username } = data;

        // Validate required fields
        if (!email || !password || !username) {
            throw new ApiError(400, 'Email, password, and username are required');
        }

        // Check for existing user
        const existingUser = await this.findOne({
            [Op.or]: [{ email }, { username }]
        }).catch(() => null);

        if (existingUser) {
            throw new ApiError(400, 'Email or username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default preferences
        const user = await super.create({
            ...data,
            password: hashedPassword,
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: true,
                itemsPerPage: 10
            }
        });

        // Remove sensitive data
        const userJson = user.toJSON();
        this.sensitiveFields.forEach(field => delete userJson[field]);

        return userJson;
    }

    /**
     * Authenticate user and generate token
     * @param {string} email - User email
     * @param {string} password - User password
     */
    async login(email, password) {
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        const user = await this.findOne({ email });
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        await super.update(user.id, { lastLogin: new Date() });

        // Remove sensitive data
        const userJson = user.toJSON();
        this.sensitiveFields.forEach(field => delete userJson[field]);

        return { user: userJson, token };
    }

    /**
     * Get user profile with statistics
     * @param {number} userId - User ID
     */
    async getProfile(userId) {
        const user = await this.getById(userId);
        
        // Get item counts
        const [categories, tasks, articles, quotes, jottings] = await Promise.all([
            Category.count({ where: { userId } }),
            Task.count({ where: { userId } }),
            Article.count({ where: { userId } }),
            Quote.count({ where: { userId } }),
            Jotting.count({ where: { userId } })
        ]);

        // Remove sensitive data
        const userJson = user.toJSON();
        this.sensitiveFields.forEach(field => delete userJson[field]);

        return {
            ...userJson,
            stats: {
                categories,
                tasks,
                articles,
                quotes,
                jottings,
                total: tasks + articles + quotes + jottings
            }
        };
    }

    /**
     * Update user profile
     * @param {number} userId - User ID
     * @param {Object} data - Update data
     */
    async updateProfile(userId, data) {
        // Don't allow direct password updates through this method
        if (data.password) {
            throw new ApiError(400, 'Password cannot be updated through this endpoint');
        }

        // Check username uniqueness if being updated
        if (data.username) {
            const existing = await this.findOne({
                username: data.username,
                id: { [Op.ne]: userId }
            }).catch(() => null);

            if (existing) {
                throw new ApiError(400, 'Username already exists');
            }
        }

        const user = await super.update(userId, data);
        
        // Remove sensitive data
        const userJson = user.toJSON();
        this.sensitiveFields.forEach(field => delete userJson[field]);

        return userJson;
    }

    /**
     * Update user password
     * @param {number} userId - User ID
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     */
    async updatePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) {
            throw new ApiError(400, 'Current and new password are required');
        }

        const user = await this.getById(userId);
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new ApiError(401, 'Current password is incorrect');
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await super.update(userId, { password: hashedPassword });

        return { message: 'Password updated successfully' };
    }

    /**
     * Update user preferences
     * @param {number} userId - User ID
     * @param {Object} preferences - User preferences
     */
    async updatePreferences(userId, preferences) {
        const user = await this.getById(userId);
        
        // Merge existing preferences with updates
        const updatedPreferences = {
            ...user.preferences,
            ...preferences
        };

        const updated = await super.update(userId, { preferences: updatedPreferences });
        
        // Remove sensitive data
        const userJson = updated.toJSON();
        this.sensitiveFields.forEach(field => delete userJson[field]);

        return userJson;
    }

    /**
     * Initiate password reset
     * @param {string} email - User email
     */
    async initiatePasswordReset(email) {
        const user = await this.findOne({ email });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await super.update(user.id, {
            resetToken,
            resetTokenExpiry
        });

        // Note: In a real application, you would send this token via email
        return { message: 'Password reset initiated' };
    }

    /**
     * Complete password reset
     * @param {string} token - Reset token
     * @param {string} newPassword - New password
     */
    async completePasswordReset(token, newPassword) {
        const user = await this.findOne({
            resetToken: token,
            resetTokenExpiry: { [Op.gt]: new Date() }
        });

        if (!user) {
            throw new ApiError(400, 'Invalid or expired reset token');
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await super.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        });

        return { message: 'Password reset successful' };
    }

    /**
     * Delete user account
     * @param {number} userId - User ID
     * @param {string} password - User password for confirmation
     */
    async deleteAccount(userId, password) {
        const user = await this.getById(userId);
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError(401, 'Invalid password');
        }

        // Delete all user data
        await Promise.all([
            Category.destroy({ where: { userId } }),
            Task.destroy({ where: { userId } }),
            Article.destroy({ where: { userId } }),
            Quote.destroy({ where: { userId } }),
            Jotting.destroy({ where: { userId } })
        ]);

        await super.delete(userId);

        return { message: 'Account deleted successfully' };
    }
}

module.exports = new UserController();
