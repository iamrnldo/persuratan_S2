const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "persuratan",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event handlers
pool.on("connect", () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("✅ Database PostgreSQL terhubung");
  }
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

/**
 * Helper query dengan conditional logging
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📝 Query executed", {
        text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        duration: `${duration}ms`,
        rows: res.rowCount,
      });
    }

    return res;
  } catch (error) {
    console.error("❌ Query error:", error.message);
    throw error;
  }
};

/**
 * Transaction helper
 */
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, withTransaction };
