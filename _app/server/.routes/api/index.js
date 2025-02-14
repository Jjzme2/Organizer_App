const express = require("express");
const router = express.Router();

const healthRoutes = require("./health");
const testRoutes = require("./test");
const taskRoutes = require("./tasks");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const categoryRoutes = require("./categories");
const taskReminderRoutes = require("./taskReminders");
const quoteRoutes = require("./quotes");
const jottingRoutes = require("./jottings");
const jottingCommentsRoutes = require("./jottingComments");
const articleRoutes = require("./articles");
const articleCommentsRoutes = require("./articleComments");
const contactILYTATRoutes = require("./contactILYTAT");

const routes = [
    {
        path: "/health",
        routes: healthRoutes
    },
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
    },
    {
        path: "/quotes",
        routes: quoteRoutes
    },
	{
		path: "/jottings",
		routes: jottingRoutes
	},
	{
		path: "/jotting-comments",
		routes: jottingCommentsRoutes
	},
	{
		path: "/articles",
		routes: articleRoutes
	},
	{
		path: "/article-comments",
		routes: articleCommentsRoutes
	},
	{
		path: "/contact-ilytat",
		routes: contactILYTATRoutes
	}
];

routes.forEach((route) => {
    router.use(route.path, route.routes);
});

module.exports = router;
