// Answer API Endpoint Implementations
// Route: POST /api/answer
// Purpose: Accept an answer to a specific question from a user.

// to Add route in Express (routes/answer.js)


const dbconnection = require("../db/db.Config");


async function postAnswer (req, res) {
  const { answer, user_id, question_id } = req.body;

  // to Validate input
  if (!answer || !user_id || !question_id) {
    return res.status(400).json({
      success: false,
      message: "Answer, user_id, and question_id are required.",
    });
  }

  try {
    const insertQuery = `
      INSERT INTO answer (answer, user_id, question_id)
      VALUES (?, ?, ?)
    `;
    await dbconnection.execute(insertQuery, [answer, user_id, question_id]);

    res.status(201).json({
      success: true,
      message: "Answer posted successfully.",
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while posting answer.",
    });
  }
};

module.exports = {postAnswer};
