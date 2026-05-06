const crypto = require("crypto");

console.log("═══════════════════════════════════════════════════════════");
console.log("🔐 JWT SECRETS GENERATOR");
console.log("═══════════════════════════════════════════════════════════");
console.log("");

const jwtSecret = crypto.randomBytes(64).toString("hex");
const jwtRefreshSecret = crypto.randomBytes(64).toString("hex");

console.log("Copy kode berikut ke file .env:");
console.log("");
console.log("# JWT Secrets (Generated)");
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log("");
console.log("═══════════════════════════════════════════════════════════");
console.log("⚠️  JANGAN SHARE SECRET INI KE SIAPAPUN!");
console.log("⚠️  SIMPAN DI .env DAN JANGAN COMMIT KE GIT!");
console.log("═══════════════════════════════════════════════════════════");

