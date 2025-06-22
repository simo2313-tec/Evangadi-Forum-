const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");

async function getAnswerComments(req, res) {
  const { answer_id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const offset = (page - 1) * pageSize;
  const sort = req.query.sort === "popular" ? "popular" : "recent";
  const userId = req.user ? req.user.userid : null;

  try {
    const answerIdNum = parseInt(answer_id, 10);
    if (isNaN(answerIdNum)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid answer_id." });
    }

    const [answer] = await dbconnection.query(`SELECT answer_id FROM answer WHERE answer_id = ?`, [answerIdNum]);
    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Answer not found." });
    }


    const [[{ total }]] = await dbconnection.query(
      `SELECT COUNT(*) as total FROM comment WHERE answer_id = ? AND parent_comment_id IS NULL`,
      [answerIdNum]
    );
    if (total === 0) {
        return res.status(StatusCodes.OK).json({ 
            success: true,
            comments: [],
            pagination: { total: 0, page: 1, pageSize, totalPages: 1 }
        });
    }

    const orderByClause = sort === 'popular' 
      ? `COALESCE(ld.likes, 0) DESC, c.created_at DESC`
      : `c.created_at DESC`;
      
    const [topLevelComments] = await dbconnection.query(
      `
      SELECT 
        c.*, r.user_name, p.first_name, p.last_name,
        COALESCE(ld.likes, 0) AS comment_likes,
        COALESCE(ld.dislikes, 0) AS comment_dislikes,
        CASE WHEN lu.is_like = 1 THEN 'like' WHEN lu.is_like = 0 THEN 'dislike' ELSE NULL END AS user_vote_type
      FROM comment c
      JOIN registration r ON c.user_id = r.user_id
      LEFT JOIN profile p ON c.user_id = p.user_id
      LEFT JOIN (
        SELECT comment_id, SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes
        FROM likes_dislikes GROUP BY comment_id
      ) ld ON c.comment_id = ld.comment_id
      LEFT JOIN likes_dislikes lu ON c.comment_id = lu.comment_id AND lu.user_id = ?
      WHERE c.answer_id = ? AND c.parent_comment_id IS NULL
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
      `,
      [userId, answerIdNum, pageSize, offset]
    );

    if (topLevelComments.length === 0) {
        return res.status(StatusCodes.OK).json({ 
            success: true,
            comments: [],
            pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
        });
    }

    const topLevelCommentIds = topLevelComments.map(c => c.comment_id);
    const [replies] = await dbconnection.query(
      `
      SELECT 
        c.*, r.user_name, p.first_name, p.last_name,
        COALESCE(ld.likes, 0) AS comment_likes,
        COALESCE(ld.dislikes, 0) AS comment_dislikes,
        CASE WHEN lu.is_like = 1 THEN 'like' WHEN lu.is_like = 0 THEN 'dislike' ELSE NULL END AS user_vote_type
      FROM comment c
      JOIN registration r ON c.user_id = r.user_id
      LEFT JOIN profile p ON c.user_id = p.user_id
      LEFT JOIN (
        SELECT comment_id, SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes
        FROM likes_dislikes GROUP BY comment_id
      ) ld ON c.comment_id = ld.comment_id
      LEFT JOIN likes_dislikes lu ON c.comment_id = lu.comment_id AND lu.user_id = ?
      WHERE c.parent_comment_id IN (?)
      ORDER BY c.created_at ASC
      `,
      [userId, topLevelCommentIds]
    );

    // 4. Map replies to their parents.
    const commentsMap = topLevelComments.reduce((acc, comment) => {
        comment.children = [];
        acc[comment.comment_id] = comment;
        return acc;
    }, {});
    
    replies.forEach(reply => {
        if (commentsMap[reply.parent_comment_id]) {
            commentsMap[reply.parent_comment_id].children.push(reply);
        }
    });

    res.status(StatusCodes.OK).json({
      success: true,
      comments: Object.values(commentsMap),
      pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    console.error(`Error fetching comments for answer_id ${answer_id}:`, err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve comments.",
    });
  }
}

module.exports = { getAnswerComments };