// Import required modules
const express = require("express");
const app = express();
const port = 5302;
const dbconnection = require("./db/db.Config");

// Start server and test database connection
async function startServer() {
  try {
    const result = await dbconnection.execute("SELECT 'test'");
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
    console.log("database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}
startServer();

// Create tables
app.get("/create", async (req, res) => {
  try {
    let create_registration = `
      CREATE TABLE IF NOT EXISTS registration (
        user_id INT(20) NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(50) NOT NULL,
        user_email VARCHAR(100) NOT NULL UNIQUE,
        pass_word VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_id)
      )`;

    let create_profile = `
      CREATE TABLE IF NOT EXISTS profile (
        user_profile_id INT(20) NOT NULL AUTO_INCREMENT,
        user_id INT(20) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        PRIMARY KEY (user_profile_id),
        FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
      )`;

    let create_question = `
      CREATE TABLE IF NOT EXISTS question (
        question_id INT(20) NOT NULL AUTO_INCREMENT,
        question VARCHAR(255) NOT NULL,
        question_description TEXT NOT NULL,
        user_id INT(20) NOT NULL,
        post_id VARCHAR(50) NOT NULL UNIQUE,
        PRIMARY KEY (question_id),
        FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
      )`;

    let create_answer = `
      CREATE TABLE IF NOT EXISTS answer (
        answer_id INT(20) NOT NULL AUTO_INCREMENT,
        question_id INT(20) NOT NULL,
        user_id INT(20) NOT NULL,
        answer TEXT NOT NULL,
        PRIMARY KEY (answer_id),
        FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
      )`;

    // Create all tables sequentially using Promises
    await dbconnection.execute(create_registration);
    await dbconnection.execute(create_profile);
    await dbconnection.execute(create_question);
    await dbconnection.execute(create_answer);

    res.send("All tables created successfully");
    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    res.status(500).send("Error creating tables: " + error.message);
  }
});
