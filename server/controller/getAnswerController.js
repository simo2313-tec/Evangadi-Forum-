const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

async function getAnswers(req, res) {
  const { question_uuid } = req.params;
  const userId = req.user?.userid;
  // Pagination params
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const offset = (page - 1) * pageSize;
  // Sorting
  const sort = req.query.sort === "popular" ? "popular" : "recent";
  let orderBy = "a.created_at DESC";
  if (sort === "popular") {
    orderBy = "likes DESC, a.created_at DESC";
  }
  try {
    // Get total count for pagination
    const countQuery = `SELECT COUNT(a.answer_id) as total FROM answer a JOIN question q ON a.question_id = q.question_id WHERE q.question_uuid = $1`;
    const { rows: countRows } = await dbconnection.query(countQuery, [
      question_uuid,
    ]);
    const total = parseInt(countRows[0]?.total || 0, 10);

    const answersQuery = `
      SELECT 
        a.answer_id,
        a.answer,
        a.created_at,
        a.user_id, 
        r.user_name,
        r.user_uuid,
        p.first_name,
        p.last_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = true THEN 'up'
          WHEN ul.is_like = false THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM question q
      LEFT JOIN answer a ON q.question_id = a.question_id
      LEFT JOIN registration r ON a.user_id = r.user_id
      LEFT JOIN profile p ON a.user_id = p.user_id
      LEFT JOIN (
        SELECT
          answer_id,
          SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          answer_id
      ) AS ld ON a.answer_id = ld.answer_id
      LEFT JOIN likes_dislikes ul ON ul.answer_id = a.answer_id AND ul.user_id = $1
      WHERE q.question_uuid = $2
      ORDER BY ${orderBy}
      LIMIT $3 OFFSET $4;
    `;
    const answerParams = [userId || 0, question_uuid, pageSize, offset];
    const { rows: results } = await dbconnection.query(
      answersQuery,
      answerParams
    );

    if (total === 0) {
      return res.status(StatusCodes.OK).json({
        answers: [],
        pagination: { total: 0, page, pageSize, totalPages: 1 },
      });
    }
    // If the question exists but has no answers
    if (results.length === 0 || results[0].answer_id === null) {
      return res.status(StatusCodes.OK).json({
        answers: [],
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }
    res.status(StatusCodes.OK).json({
      answers: results,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error(
      `Error fetching answers for question_uuid ${question_uuid}:`,
      err
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve answers.",
      error: err.message,
    });
  }
}

module.exports = { getAnswers };
