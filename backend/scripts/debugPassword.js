const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "persuratan",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function fixAdmin() {
  try {
    console.log("🔧 Fixing admin password...");

    // Generate new hash
    const password = "Admin@1234";
    const hash = await bcrypt.hash(password, 12);

    console.log("Password:", password);
    console.log("New hash:", hash);

    // Update admin
    const updateResult = await pool.query(
      "UPDATE admin SET password = $1 WHERE username = 'superadmin' RETURNING id",
      [hash],
    );

    console.log("✅ Rows updated:", updateResult.rowCount);

    // Test immediately
    const testResult = await pool.query(
      "SELECT password FROM admin WHERE username = 'superadmin'",
    );

    const savedHash = testResult.rows[0].password;
    console.log("Saved hash:", savedHash);

    const testMatch = await bcrypt.compare(password, savedHash);
    console.log("🧪 Immediate test result:", testMatch);

    if (testMatch) {
      console.log("✅ Password fix SUCCESS!");
    } else {
      console.log("❌ Password fix FAILED!");
    }

    await pool.end();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fixAdmin();
