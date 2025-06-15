const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

async function getAnswers(req, res) {
  const { question_id } = req.params;

  try {
    const [answers] = await dbconnection.query(
      `
      SELECT 
        answer.*,
        registration.user_name,
        profile.first_name,
        profile.last_name
      FROM answer
      INNER JOIN registration ON answer.user_id = registration.user_id
      LEFT JOIN profile ON registration.user_id = profile.user_id
      WHERE answer.question_id = ?
      ORDER BY answer.created_at DESC
      `,
      [question_id]
    );

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Error fetching answers:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve answers.",
      error: error.message,
    });
  }
}

module.exports = { getAnswers };
