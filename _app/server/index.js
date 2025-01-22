require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const morgan = require("morgan"); // For HTTP request logging
const winston = require("winston"); // For more advanced logging (if needed)

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(morgan("dev")); // Use Morgan for request logging (in 'dev' format)

// Winston logger setup (example - customize as needed)
const logger = winston.createLogger({
  level: "info", // Log level (info, error, debug, etc.)
  format: winston.format.json(), // Log format
  transports: [
    new winston.transports.Console(), // Log to console
    // Add other transports like File transport if needed
  ],
});

// Routes
const apiRoutes = require('./.routes/api'); 
app.use('/api', apiRoutes); // Mount all API routes under '/api'


// Error handling middleware (example)
app.use((err, req, res, next) => {
  logger.error(err.stack); // Log the error using Winston
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
