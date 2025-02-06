const jwt = require("jsonwebtoken");
const logger = require("./logger");

// Ensure secrets are provided
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET || !process.env.EMAIL_TOKEN_SECRET) {
    logger.error("JWT_SECRET, REFRESH_TOKEN_SECRET, and EMAIL_TOKEN_SECRET must be set in environment variables");
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authUtility = {
    generateToken(user) {
        if (!user || !user.id) {
            throw new Error("Invalid user object provided");
        }

        const payload = {
            id: user.id,
            username: user.name,
            email: user.email,
            tokenVersion: process.env.TOKEN_VERSION || '1', // Add token version to payload
            type: 'access'
        };

        const options = {
            expiresIn: "1h",
            algorithm: "HS256", // Explicitly specify the algorithm
            notBefore: 0 // Token is valid immediately
        };

        return jwt.sign(payload, JWT_SECRET, options);
    },

    generateRefreshToken(user) {
        if (!user || !user.id) {
            throw new Error("Invalid user object provided");
        }

        const payload = {
            id: user.id,
            tokenVersion: user.tokenVersion || 0,
            type: 'refresh'
        };

        const options = {
            expiresIn: "7d",
            algorithm: "HS256",
            notBefore: 0
        };

        return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
    },

    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET, {
                algorithms: ["HS256"] // Only allow HS256 algorithm
            });

            // Verify token type
            if (decoded.type !== 'access') {
                logger.warn('Invalid token type provided to verifyToken');
                return null;
            }

            return decoded;
        } catch (error) {
            logger.error('Token verification failed:', error.message);
            return null;
        }
    },

    verifyRefreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, {
                algorithms: ["HS256"]
            });

            // Verify token type
            if (decoded.type !== 'refresh') {
                logger.warn('Invalid token type provided to verifyRefreshToken');
                return null;
            }

            return decoded;
        } catch (error) {
            logger.error('Refresh token verification failed:', error.message);
            return null;
        }
    },

	generateResetToken(userId) {
		return jwt.sign({ userId, type: "reset" }, process.env.RESET_TOKEN_SECRET, { expiresIn: "1h" });
	},

	verifyResetToken(token) {
		try {
			const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET, {
				algorithms: ["HS256"]
			});

			// Verify token type
			if (decoded.type !== 'reset') {
				logger.warn('Invalid token type provided to verifyResetToken');
				return null;
			}

			return decoded;
		} catch (error) {
			logger.error('Reset token verification failed:', error.message);
			return null;
		}
	},

    generateEmailToken(userId) {
        return jwt.sign(
            {
                id: userId,
                type: 'email-verification'
            },
            process.env.EMAIL_TOKEN_SECRET,
            {
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );
    },

    verifyEmailToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, {
                algorithms: ['HS256']
            });

            // Verify token type
            if (decoded.type !== 'email-verification') {
                logger.warn('Invalid token type provided to verifyEmailToken');
                return null;
            }

            return decoded;
        } catch (error) {
            logger.error('Email verification token verification failed:', error.message);
            return null;
        }
    }
};

module.exports = authUtility;
