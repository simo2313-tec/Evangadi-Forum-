require("dotenv").config(); // Load environment variables from .env

const mysql2 = require("mysql2/promise"); // Import mysql2 for promise-based queries, but for callbacks we use mysql2/callback or mysql2 only

// const dbconnection = mysql2.createPool({
//   host: "localhost",
//   user: "evangadi_admin",
//   password: "123456",
//   database: "evangadi_forum",
//   connectionLimit: 10,
// });

//! using .env for sensitive credentials
const dbconnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
});

module.exports = dbconnection;
