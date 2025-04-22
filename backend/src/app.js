const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/apiRoutes");
const db = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const statusMonitor = require("express-status-monitor");
const app = express();

// Use bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use logging with morgan
app.use(morgan("dev"));

// Use status monitor to track server performance
app.use(statusMonitor());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// API routes
app.use("/api", apiRoutes);

module.exports = app;
