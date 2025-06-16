// const dbconnection = require("../db/db.Config");
// const { StatusCodes } = require("http-status-codes");

// async function getquestions(req, res) {
//   try {
//     const [question] = await dbconnection.query(
//       "SELECT q.*, r.user_name FROM question q JOIN registration r ON q.user_id=r.user_id ORDER BY q.created_at DESC"
//     );
//     res.status(StatusCodes.ACCEPTED).json({ question });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "error retrieving question", error: error.message });
//   }
// }

// //! getSigleQuestion 
// async function getSingleQuestion(req, res) {
//   try {

//     const { id } = req.params; //! Get question ID from the URL parameter

//     const [questions] = await dbconnection.query(

//       "SELECT q.*, r.user_name FROM question q JOIN registration r ON q.user_id=r.user_id WHERE q.question_id = ?",
//       [id]
//     );

//     if (questions.length === 0) {

//       return res

//         .status(StatusCodes.NOT_FOUND) //!(404, not-found)

//         .json({ message: "Question not found" });
//     }
//     res.status(StatusCodes.OK).json({ question: questions[0] }); //!(200, ok)

//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR) //!(500,Internal Server Error)
      
//       .json({ message: "Error retrieving question", error: error.message });
//   }
// }


// module.exports = {getquestions,  getSingleQuestion};




const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

/**
 * Fetches all questions, joining with user_name and like/dislike counts.
 */
async function getquestions(req, res) {
  try {
    // This SQL query is now more powerful.
    // It joins questions, registrations, and a subquery that calculates votes.
    const [questions] = await dbconnection.query(`
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      ORDER BY
        q.created_at DESC;
    `);

    res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving questions" });
  }
}

/**
 * Fetches a single question by ID, including user_name and like/dislike counts.
 */
async function getSingleQuestion(req, res) {
  try {
    const { id } = req.params;

    // The same powerful query, but with a WHERE clause to filter by a single question ID.
    const [questions] = await dbconnection.query(
      `
      SELECT
        q.*,
        r.user_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      WHERE q.question_id = ?
    `,
      [id]
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }

    res.status(StatusCodes.OK).json({ question: questions[0] });
  } catch (error) {
    console.error(`Error retrieving question with id ${req.params.id}:`, error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving question" });
  }
}

module.exports = { getquestions, getSingleQuestion };



