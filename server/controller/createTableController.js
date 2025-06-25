const dbconnection = require("../db/db.Config");
const {
  create_registration,
  create_answer,
  create_profile,
  create_question,
  create_likes_dislikes,
  create_comment,
  create_password_reset_tokens,
  // Indexes
  create_idx_question_user_id,
  create_idx_question_uuid,
  create_idx_registration_uuid,
  create_idx_question_tag,
  create_idx_answer_question_id,
  create_idx_comment_answer_id,
  create_idx_comment_parent_comment_id,
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

    // Create indexes
    await dbconnection.query(create_idx_question_user_id);
    await dbconnection.query(create_idx_question_uuid);
    await dbconnection.query(create_idx_registration_uuid);
    await dbconnection.query(create_idx_question_tag);
    await dbconnection.query(create_idx_answer_question_id);
    await dbconnection.query(create_idx_comment_answer_id);
    await dbconnection.query(create_idx_comment_parent_comment_id);

    res.send("All tables and indexes created successfully");
  } catch (err) {
    res.status(500).send("Error creating tables or indexes: " + err.message);
  }
}

module.exports = { createTable };
