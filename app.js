// Import required modules
const express = require("express");
const app = express();
const port = 5400;
const dbconnection = require("./db/db.Config");

// Start server and test database connection
async function startServer() {
  try {
    const result = await dbconnection.execute("SELECT 'test'");
    await app.listen(port);
    console.log(`Server is running on port ${port}`);
    console.log("data base connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}
startServer();

// Create tables
app.get("/create", async (req, res) => {
  let create_users = `
    CREATE TABLE IF NOT EXISTS users (
      userid INT(20) NOT NULL AUTO_INCREMENT,
      username VARCHAR(20) NOT NULL,
      firstname VARCHAR(20) NOT NULL,
      lastname VARCHAR(20) NOT NULL,
      email VARCHAR(40) NOT NULL,
      password VARCHAR(100) NOT NULL,
      PRIMARY KEY (userid)
    )`;

  let create_questions = `
    CREATE TABLE IF NOT EXISTS questions (
      id INT(20) NOT NULL AUTO_INCREMENT,
      questionid VARCHAR(100) NOT NULL UNIQUE,
      userid INT(20) NOT NULL,
      title VARCHAR(50) NOT NULL,
      description VARCHAR(200) NOT NULL,
      tag VARCHAR(20),
      PRIMARY KEY (id, questionid),
      FOREIGN KEY (userid) REFERENCES users(userid)
    )`;

  let create_answers = `
    CREATE TABLE IF NOT EXISTS answers (
      answerid VARCHAR(100) NOT NULL,
      userid INT(20) NOT NULL,
      questionid VARCHAR(100) NOT NULL,
      answer VARCHAR(200) NOT NULL,
      PRIMARY KEY (answerid),
      FOREIGN KEY (questionid) REFERENCES questions(questionid),
      FOREIGN KEY (userid) REFERENCES users(userid)
    )`;

  try {
    await dbconnection.query(create_users);
    await dbconnection.query(create_questions);
    await dbconnection.query(create_answers);
    res.send("All tables created successfully");
  } catch (err) {
    res.status(500).send("Error creating tables: " + err.message);
  }
});
