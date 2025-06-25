const db = require("../db/db.Config.js");

async function initDB(req, res) {
  try {
    // Simple query to check connection
    await db.query("SELECT NOW()");
    res.send("Connected to PostgreSQL database successfully.");
  } catch (err) {
    res.status(500).send("Error connecting to PostgreSQL database: " + err.message);
  }
}

module.exports = { initDB };
