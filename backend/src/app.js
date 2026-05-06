const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const { generalLimiter } = require("./middlewares/rateLimiter");

const app = express();

// ==================== Security Middleware ====================
app.use(helmet());

// ==================== CORS ====================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ==================== Logger ====================
if (process.env.NODE_ENV === "development") {
  // Development: log ke console
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  // Production: log ke file
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, "access.log"),
    { flags: "a" }
  );
  app.use(morgan("combined", { stream: accessLogStream }));
}

// ==================== Body Parser ====================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== Trust Proxy ====================
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ==================== Rate Limiting ====================
// Apply general rate limiter ke semua API routes
app.use("/api/", generalLimiter);

// ==================== Health Check ====================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server berjalan dengan baik",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  });
});

// ==================== API Routes ====================
app.use("/api/v1", routes);

// ==================== Not Found ====================
app.use(notFound);

// ==================== Error Handler ====================
app.use(errorHandler);

module.exports = app;
