const express = require("express");
const router = express.Router();

const testRoutes = require("./test");
const healthRoutes = require("./health");

const routes = [
    {
        path: "/health",
        routes: healthRoutes
    },
    {
        path: "/test",
        routes: testRoutes
    }
]

routes.forEach(route => {
    router.use(route.path, route.routes);
})

module.exports = router;