const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function getAnswerComments(req, res) {
  const { answer_id } = req.params;
  const userId = req.user ? req.user.userid : null;

  try {
    const answerIdNum = parseInt(answer_id, 10);
    if (isNaN(answerIdNum)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid answer_id." });
    }

    const [answer] = await dbconnection.query(
      `SELECT answer_id FROM answer WHERE answer_id = ?`,
      [answerIdNum]
    );
    if (answer.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Answer not found." });
    }

    const [comments] = await dbconnection.query(
      `
      SELECT 
        c.*, 
        r.user_name, 
        r.user_uuid,
        p.first_name, 
        p.last_name,
        COALESCE(ld.likes, 0) AS likes,
        COALESCE(ld.dislikes, 0) AS dislikes,
        CASE 
          WHEN lu.is_like = 1 THEN 'like' 
          WHEN lu.is_like = 0 THEN 'dislike' 
          ELSE NULL 
        END AS user_vote_type
      FROM comment c
      JOIN registration r ON c.user_id = r.user_id
      LEFT JOIN profile p ON c.user_id = p.user_id
      LEFT JOIN (
        SELECT 
          comment_id, 
          SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes, 
          SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM likes_dislikes 
        GROUP BY comment_id
      ) ld ON c.comment_id = ld.comment_id
      LEFT JOIN likes_dislikes lu ON c.comment_id = lu.comment_id AND lu.user_id = ?
      WHERE c.answer_id = ?
      ORDER BY c.created_at ASC
      `,
      [userId, answerIdNum]
    );

    res.status(StatusCodes.OK).json({
      success: true,
      comments: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error" });
  }
}

module.exports = getAnswerComments;
