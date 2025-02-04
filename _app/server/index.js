require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const morgan = require("morgan"); // For HTTP request logging
const cors = require("cors");
const logger = require("./utils/logger"); // For more advanced logging (if needed)
const path = require('path');

const allowedOrigins = ['http://localhost:5173', 'https://www.ilytat.com'];

// Services
const emailService = require('./services/emailService');
const logEmailService = require('./services/logEmailService');
const taskReminderService = require('./services/taskReminderService');


const middleware = require("./middleware"); // Import middleware

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
	origin: function (origin, callback) {
		if(!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Use Morgan for request logging (in 'dev' format)

// Custom middleware
app.use(middleware.apiMiddleware); // Use your custom API middleware

// Initialize email service
(async () => {
  try {
    await emailService.initialize();
    logger.info('Email services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize email services:', error);
  }
})();

// Routes
const apiRoutes = require('./.routes/api');
app.use('/api', apiRoutes); // Mount all API routes under '/api'

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle SPA routing - send all non-API requests to index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack); // Log the error using Winston
    res.status(500).json({
        error: "Something went wrong!",
        message: err.message
    });
});

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
