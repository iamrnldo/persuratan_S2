// scripts/generateHash.js
// Jalankan: node scripts/generateHash.js
const bcrypt = require("bcryptjs");

const password = "Admin@1234"; // ganti sesuai kebutuhan
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);

console.log("Password :", password);
console.log("Hash     :", hash);
// Copy hash ini ke query INSERT admin
