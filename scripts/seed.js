/**
 * Seed Script for Pro Tech Enterprises
 * Re-initializes persistent storage with factory defaults.
 */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "pte_database.json");

console.log("Seeding Pro Tech Enterprises database...");

if (fs.existsSync(dataFile)) {
  fs.unlinkSync(dataFile);
  console.log("Removed old database file.");
}

console.log("Database reset. Next server start will populate factory defaults.");
