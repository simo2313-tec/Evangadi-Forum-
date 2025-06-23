const dbconnection = require("../db/db.Config");
const {
  create_registration,
  create_answer,
  create_profile,
  create_question,
  create_likes_dislikes,
  create_comment,
  create_password_reset_tokens,
} = require("../db/tables.js");

async function createTable(req, res) {
  try {
    await dbconnection.query(create_registration);
    await dbconnection.query(create_profile);
    await dbconnection.query(create_question);
    await dbconnection.query(create_answer);
    await dbconnection.query(create_comment);
    await dbconnection.query(create_likes_dislikes);
    await dbconnection.query(create_password_reset_tokens);
    res.send("All tables created successfully");
  } catch (err) {
    res.status(500).send("Error creating tables: " + err.message);
  }
}

module.exports = { createTable };
