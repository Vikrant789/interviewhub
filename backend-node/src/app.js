require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

/**
 * Security Headers
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

/**
 * Logging
 */
app.use(morgan("combined"));

/**
 * Body Parsers
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InterviewHub API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Routes
 */

const auth = require("./middleware/auth.middleware");

app.use("/api/auth", require("./routes/auth.routes"));


app.use("/api/users", auth, require("./routes/users.routes"));
app.use("/api/companies", auth, require("./routes/companies.routes"));
app.use("/api/applications", auth, require("./routes/applications.routes"));
app.use("/api/interviews", auth, require("./routes/interviews.routes"));

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

module.exports = app;