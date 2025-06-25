require("dotenv").config(); // Load environment variables from .env

const { Pool } = require("pg");

// Use DATABASE_URL if available, otherwise fall back to individual env vars
const dbconnection = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      max: process.env.DB_CONNECTION_LIMIT || 10,
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    });

// All Pool methods are promise-based by default in 'pg'.
// Example usage:
// const { rows } = await dbconnection.query('SELECT NOW()');

module.exports = dbconnection;
