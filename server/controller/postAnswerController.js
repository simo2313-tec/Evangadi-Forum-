const dbconnection = require("../db/db.Config");
const { sendAnswerNotification } = require("../services/mailer");

async function postAnswer(req, res) {
  const { answer, user_id, question_id } = req.body;

  if (!answer || !user_id || !question_id) {
    return res.status(400).json({
      success: false,
      message: "Answer, user_id, and question_id are required.",
    });
  }

  try {
    // Insert answer with automatic timestamp
    const insertQuery = `
      INSERT INTO answer (answer, user_id, question_id)
      VALUES (?, ?, ?)
    `;
    await dbconnection.execute(insertQuery, [answer, user_id, question_id]);

    // Fetch email of the user who asked the question
    const [questionRows] = await dbconnection.query(
      `SELECT r.user_email 
       FROM question q 
       JOIN registration r ON q.user_id = r.user_id 
       WHERE q.question_id = ?`,
      [question_id]
    );

    if (questionRows.length > 0) {
      const email = questionRows[0].user_email;
      await sendAnswerNotification(email, question_id);
    }

    res.status(201).json({
      success: true,
      message: "Answer posted successfully and email sent.",
    });
  } catch (error) {
    console.error("Error posting answer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while posting answer.",
    });
  }
}

module.exports = { postAnswer };
