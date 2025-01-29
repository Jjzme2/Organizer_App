const express = require("express");
const router = express.Router();

const testRoutes = require("./test");
const taskRoutes = require("./tasks");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const categoryRoutes = require("./categories");
const taskReminderRoutes = require("./taskReminders");

const routes = [
    {
        path: "/test",
        routes: testRoutes
    },
    {
        path: "/tasks",
        routes: taskRoutes
    },
    {
        path: "/auth",
        routes: authRoutes
    },
    {
        path: "/users",
        routes: userRoutes
    },
    {
        path: "/categories",
        routes: categoryRoutes
    },
    {
        path: "/task-reminders",
        routes: taskReminderRoutes
    }
];

routes.forEach((route) => {
    router.use(route.path, route.routes);
});

module.exports = router;
