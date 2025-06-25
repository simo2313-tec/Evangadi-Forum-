const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

// this module contains both endpoints related with fetching questions

/**
 * Fetches all questions, joining with user_name and like/dislike counts.
 */
async function getquestions(req, res) {
  try {
    const userId = req.user?.userid;
    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;
    // Sorting
    const sort = req.query.sort === "popular" ? "popular" : "recent";
    let orderBy = "q.created_at DESC";
    if (sort === "popular") {
      orderBy = "likes DESC, q.created_at DESC";
    }
    // Search
    const search = req.query.search ? req.query.search.trim() : null;
    let whereClause = "";
    let params = [userId || 0];
    let paramIdx = 2;
    if (search) {
      whereClause = `WHERE (q.tag ILIKE $${paramIdx} OR q.question_title ILIKE $${
        paramIdx + 1
      } OR q.question_description ILIKE $${paramIdx + 2})`;
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch, likeSearch);
      paramIdx += 3;
    }
    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM question q ${whereClause}`;
    const countParams = params.slice(1);
    const { rows: countRows } = await dbconnection.query(
      countQuery,
      countParams
    );
    const total = parseInt(countRows[0]?.total || 0, 10);
    // Fetch paginated questions
    params.push(pageSize, offset);
    const questionsQuery = `
      SELECT
        q.*,
        r.user_name,
        r.user_uuid,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = true THEN 'up'
          WHEN ul.is_like = false THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul ON ul.question_id = q.question_id AND ul.user_id = $1
      ${whereClause}
      ORDER BY
        ${orderBy}
      LIMIT $${params.length - 1} OFFSET $${params.length};
    `;
    const { rows: questions } = await dbconnection.query(
      questionsQuery,
      params
    );
    res.status(StatusCodes.OK).json({
      questions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
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
    const { question_uuid } = req.params;
    const userId = req.user?.userid;
    const { rows: questions } = await dbconnection.query(
      `
      SELECT
        q.*,
        r.user_name,
        r.user_uuid,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE
          WHEN ul.is_like = true THEN 'up'
          WHEN ul.is_like = false THEN 'down'
          ELSE NULL
        END AS user_vote_type
      FROM
        question q
      JOIN
        registration r ON q.user_id = r.user_id
      LEFT JOIN (
        SELECT
          question_id,
          SUM(CASE WHEN is_like = true THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN is_like = false THEN 1 ELSE 0 END) AS dislikes
        FROM
          likes_dislikes
        GROUP BY
          question_id
      ) AS ld ON q.question_id = ld.question_id
      LEFT JOIN likes_dislikes ul ON ul.question_id = q.question_id AND ul.user_id = $1
      WHERE q.question_uuid = $2
    `,
      [userId || 0, question_uuid]
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }
    res.status(StatusCodes.OK).json({ question: questions[0] });
  } catch (error) {
    console.error(
      `Error retrieving question with id ${req.params.id}:`,
      error.message
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving question" });
  }
}

module.exports = { getquestions, getSingleQuestion };
