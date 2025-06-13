const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function getAnswer(req, res) {
  const questionId = req.params.question_id;

  try {
    // 1. Check if the question exists
    const [questionCheck] = await dbconnection.query(
      "SELECT * FROM question WHERE question_id = ?",
      [questionId]
    );

    if (questionCheck.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    // 2. If the question exists, get its answers
    const query = `
      SELECT 
        answer.*,
        registration.user_name,
        profile.first_name,
        profile.last_name
      FROM answer
      INNER JOIN registration ON answer.user_id = registration.user_id
      LEFT JOIN profile ON registration.user_id = profile.user_id
      WHERE answer.question_id = ? ORDER BY answer.created_at DESC
    `;

    const [answers] = await dbconnection.query(query, [questionId]);

    // Return empty array if no answers yet (don't return 404)
    res.status(StatusCodes.OK).json(answers);
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}


module.exports = { getAnswer };
