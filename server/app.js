const express = require("express");
const app = express();
const port = 5400;
const dbconnection = require("./db/db.Config");

// User routes 
const userRouters = require("./routes/userRoute");

app.use("/api/users", userRouters);
console.log(typeof userRouters);

// o



// Start server and test database connection
async function startServer() {
  try {
    const result = await dbconnection.execute("SELECT 'test'");
    await app.listen(port);
    console.log(`Server is running on: http://localhost:${port}`);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

startServer();

// Create tables
app.get("/create", async (req, res) => {
  // Registration table
  let create_registration = `
    CREATE TABLE IF NOT EXISTS registration (
      user_id int NOT NULL AUTO_INCREMENT,
      user_name varchar(50) NOT NULL,
      user_email varchar(254) NOT NULL,
      password varchar(100) NOT NULL,
      PRIMARY KEY (user_id)
    )`;

  // Profile table
  let create_profile = `
    CREATE TABLE IF NOT EXISTS profile (
      user_profile_id int NOT NULL AUTO_INCREMENT,
      user_id int NOT NULL,
      first_name varchar(50) NOT NULL,
      last_name varchar(50) NOT NULL,
      PRIMARY KEY (user_profile_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id)
    )`;

  // Question table
  let create_question = `
    CREATE TABLE IF NOT EXISTS question (
      question_id int NOT NULL AUTO_INCREMENT,
      question_title varchar(100) NOT NULL,
      question_description text,
      tag varchar(20),
      user_id int NOT NULL,
      post_id int NOT NULL UNIQUE,
      PRIMARY KEY (question_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id)
    )`;

  // Answer table
  let create_answer = `
    CREATE TABLE IF NOT EXISTS answer (
      answer_id int NOT NULL AUTO_INCREMENT,
      answer text NOT NULL,
      user_id int NOT NULL,
      question_id int NOT NULL,
      PRIMARY KEY (answer_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id),
      FOREIGN KEY (question_id) REFERENCES question(question_id)
    )`;

  try {
    await dbconnection.query(create_registration);
    await dbconnection.query(create_profile);
    await dbconnection.query(create_question);
    await dbconnection.query(create_answer);
    res.send("All tables created successfully");
  } catch (err) {
    res.status(500).send("Error creating tables: " + err.message);
  }
});

// Endpoint to create database and user with privileges
app.get("/initdb", async (req, res) => {
  // Use a root connection for DB/user creation
  const mysql = require("mysql2/promise");
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root", // XAMPP default root password is empty string and for MAMP default root password is 'root'
    });

    // Create database
    await rootConn.query("CREATE DATABASE IF NOT EXISTS evangadi_forum");

    // Create user and grant privileges
    await rootConn.query(
      "CREATE USER IF NOT EXISTS 'evangadi_admin'@'localhost' IDENTIFIED BY '123456'"
    );
    await rootConn.query(
      "GRANT ALL PRIVILEGES ON evangadi_forum.* TO 'evangadi_admin'@'localhost'"
    );
    await rootConn.query("FLUSH PRIVILEGES"); // to make sure that privileges are updated/refreshed on grant table in MYSQL memory

    res.send("Database and user created with all privileges.");
  } catch (err) {
    res.status(500).send("Error initializing database/user: " + err.message);
  } finally {
    // to make sure that the root connection is closed; finally block execute independently of try/catch
    if (rootConn) await rootConn.end();
  }
});
