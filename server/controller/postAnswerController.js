const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const { sendAnswerNotification } = require("../services/mailer");
const xss = require("xss");

async function postAnswer(req, res) {
  // The user_id is now taken from the authenticated user token, not the request body.
  const { answer, question_uuid } = req.body;
  const user_id = req.user?.userid;

  // Validate authentication first
  if (!user_id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: User not authenticated. Please log in.",
    });
  }

  // Validate input
  if (!answer || !question_uuid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Answer and question_uuid are required.",
    });
  }

  // Sanitize answer to prevent XSS
  const sanitizedAnswer = xss(answer);

  try {
    // Check if question exists
    const [question] = await dbconnection.query(
      "SELECT question_id FROM question WHERE question_uuid = ?",
      [question_uuid]
    );
    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Question not found.",
      });
    }
    const questionIdNum = question[0].question_id;

    // Insert answer
    const insertQuery = `
      INSERT INTO answer (answer, user_id, question_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const [result] = await dbconnection.query(insertQuery, [
      sanitizedAnswer,
      user_id, // Use the secure user_id from the token
      questionIdNum,
    ]);

    // Fetch email of the user who asked the question
    const [questionRows] = await dbconnection.query(
      `SELECT r.user_email 
       FROM question q 
       JOIN registration r ON q.user_id = r.user_id 
       WHERE q.question_id = ?`,
      [questionIdNum]
    );

    if (questionRows.length > 0) {
      const email = questionRows[0].user_email;
      await sendAnswerNotification(email, question_uuid);
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Answer posted successfully.",
      answerId: result.insertId,
    });
  } catch (error) {
    console.error("Error posting answer:", {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage || null,
      sql: error.sql || null,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.sqlMessage || "Server error while posting answer.",
    });
  }
}

module.exports = { postAnswer };
