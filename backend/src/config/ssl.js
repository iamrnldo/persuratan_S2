const fs = require("fs");
const path = require("path");

/**
 * SSL Configuration untuk HTTPS
 */
const getSSLConfig = () => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SSL_ENABLED === "true"
  ) {
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, "../../ssl/privkey.pem")),
        cert: fs.readFileSync(path.join(__dirname, "../../ssl/fullchain.pem")),
      };
    } catch (error) {
      console.error("❌ SSL Certificate tidak ditemukan:", error.message);
      console.log("⚠️  Server akan berjalan tanpa HTTPS");
      return null;
    }
  }
  return null;
};

module.exports = { getSSLConfig };
