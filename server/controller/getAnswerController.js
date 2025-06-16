const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

async function getAnswers(req, res) {
  const { question_id } = req.params;
  const userId = req.user?.userid;
  try {
    const [results] = await dbconnection.query(
      `
      SELECT 
        a.answer_id,
        a.answer,
        a.created_at,
        r.user_name,
        p.first_name,
        p.last_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = 1 THEN 'up'
          WHEN ul.is_like = 0 THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM question q
      LEFT JOIN answer a ON q.question_id = a.question_id
      LEFT JOIN registration r ON a.user_id = r.user_id
      LEFT JOIN profile p ON a.user_id = p.user_id
      LEFT JOIN (
        SELECT
          answer_id,
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          answer_id
      ) AS ld ON a.answer_id = ld.answer_id
      LEFT JOIN likes_dislikes ul ON ul.answer_id = a.answer_id AND ul.user_id = ?
      WHERE q.question_id = ?
      ORDER BY a.created_at DESC;
    `,
      [userId || 0, question_id]
    );

    // Case 1: The question itself does not exist. The query will return zero rows.
    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found." });
    }

    // Case 2: The question exists, but has no answers.
    // The query returns one row where answer_id is null.
    if (results[0].answer_id === null) {
      return res.status(StatusCodes.OK).json([]);
    }

    // Case 3: The question and answers exist. The data is already in the perfect format.
    res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error(
      `Error fetching answers for question_id ${question_id}:`,
      err
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve answers.",
      error: err.message,
    });
  }
}

module.exports = { getAnswers };
