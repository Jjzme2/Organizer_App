const express = require("express");
const router = express.Router();

const testRoutes = require("./test");
router.use("/test", testRoutes); // Mount common routes

const taskRoutes = require("./tasks");
router.use("/tasks", taskRoutes); // Mount task routes

const userRoutes = require("./user");
router.use("/users", userRoutes); // Mount user routes

// Import and mount other API route files


module.exports = router;
