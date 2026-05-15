// backend/server.js
const http = require("http");
const https = require("https");
const app = require("./src/app");
const { db } = require("./src/config/database"); // ← ganti pool → db
const { getSSLConfig } = require("./src/config/ssl");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// SSL Configuration
const sslConfig = getSSLConfig();

// Create Server (HTTP atau HTTPS)
const server = sslConfig
  ? https.createServer(sslConfig, app)
  : http.createServer(app);

server.listen(PORT, () => {
  // ← hapus async, SQLite tidak butuh await koneksi
  console.log("================================================");
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📌 Environment: ${NODE_ENV}`);
  console.log(`🔐 Protocol: ${sslConfig ? "HTTPS" : "HTTP"}`);
  console.log(`🔗 URL: ${sslConfig ? "https" : "http"}://localhost:${PORT}`);
  console.log(
    `📡 API: ${sslConfig ? "https" : "http"}://localhost:${PORT}/api/v1`,
  );
  console.log("================================================");

  // Test koneksi SQLite — sync, langsung cek
  try {
    db.prepare("SELECT 1").get();
    console.log("✅ Koneksi database SQLite berhasil");
  } catch (error) {
    console.error("❌ Koneksi database gagal:", error.message);
    process.exit(1);
  }
});

// Graceful shutdown
const shutdown = (signal) => {
  // ← hapus async
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("🔌 HTTP server closed");

    try {
      db.close(); // ← ganti pool.end() → db.close()
      console.log("🔌 Database connection closed");
      console.log("✅ Server shutdown complete");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force close after 10s
  setTimeout(() => {
    console.error("⚠️  Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  shutdown("UNCAUGHT_EXCEPTION");
});
