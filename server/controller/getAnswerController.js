// const { StatusCodes } = require("http-status-codes");
// const dbconnection = require("../db/db.Config");

// async function getAnswer(req, res) {
//   const questionId = req.params.question_id;

//   try {
//     // 1. Check if the question exists
//     const [questionCheck] = await dbconnection.query(
//       "SELECT * FROM question WHERE question_id = ?",
//       [questionId]
//     );

//     if (questionCheck.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         error: "Not Found",
//         message: "The requested question could not be found.",
//       });
//     }

//     // 2. If the question exists, get its answers
//     const query = `
//       SELECT 
//         answer.*,
//         registration.user_name,
//         profile.first_name,
//         profile.last_name
//       FROM answer
//       INNER JOIN registration ON answer.user_id = registration.user_id
//       LEFT JOIN profile ON registration.user_id = profile.user_id
//       WHERE answer.question_id = ? ORDER BY answer.created_at DESC
//     `;

//     const [answers] = await dbconnection.query(query, [questionId]);

//     // Return empty array if no answers yet (don't return 404)
//     res.status(StatusCodes.OK).json(answers);
//   } catch (err) {
//     console.error(err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: "Internal Server Error",
//       message: "An unexpected error occurred.",
//     });
//   }
// }


// module.exports = { getAnswer };



const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

/**
 * Fetches all answers for a given question_id, including user info
 * and the like/dislike count for each answer.
 */
async function getAnswer(req, res) {
  const { question_id } = req.params;

  try {
    // This single, powerful query does everything:
    // 1. Checks if the question exists (by using it as the primary table).
    // 2. Gathers all answers.
    // 3. Joins user information.
    // 4. Calculates and joins like/dislike counts for each answer.
    const query = `
      SELECT 
        a.answer_id,
        a.answer,
        a.created_at,
        r.user_name,
        p.first_name,
        p.last_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes
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
      WHERE q.question_id = ?
      ORDER BY a.created_at DESC;
    `;
    const [results] = await dbconnection.query(query, [question_id]);

    // Case 1: The question itself does not exist. The query will return zero rows.
    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found." });
    }

    // Case 2: The question exists, but has no answers.
    // The query returns one row where answer_id is null.
    if (results[0].answer_id === null) {
      return res.status(StatusCodes.OK).json([]);
    }
    
    // Case 3: The question and answers exist. The data is already in the perfect format.
    res.status(StatusCodes.OK).json(results);

  } catch (err) {
    console.error(`Error fetching answers for question_id ${question_id}:`, err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred while fetching answers.",
    });
  }
}

module.exports = { getAnswer };

