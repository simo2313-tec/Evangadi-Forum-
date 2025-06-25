const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const xss = require("xss");

async function postComment(req, res) {
  // The user ID is now securely taken from the authenticated user's token.
  const userId = req.user?.userid;
  const { comment_text, answer_id, parent_comment_id } = req.body;

  // Validate authentication first
  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  // Validate required fields from the request body
  if (!comment_text?.trim() || !answer_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Comment text and answer ID are required",
    });
  }

  // Sanitize and validate inputs
  const sanitizedComment = xss(comment_text.trim());
  const answerId = parseInt(answer_id, 10);
  const parentCommentId = parent_comment_id
    ? parseInt(parent_comment_id, 10)
    : null;

  if (isNaN(answerId) || (parent_comment_id && isNaN(parentCommentId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  try {
    // Verify answer exists
    const { rows: answer } = await dbconnection.query(
      "SELECT user_id FROM answer WHERE answer_id = $1",
      [answerId]
    );

    if (!answer.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Verify parent comment if provided
    if (parentCommentId) {
      const { rows: parentComment } = await dbconnection.query(
        "SELECT comment_id, user_id FROM comment WHERE comment_id = $1 AND answer_id = $2",
        [parentCommentId, answerId]
      );
      if (!parentComment.length) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Parent comment not found for this answer",
        });
      }
    }

    // Insert comment
    const insertQuery =
      "INSERT INTO comment (comment_text, user_id, answer_id, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING comment_id";
    const { rows: insertRows } = await dbconnection.query(insertQuery, [
      sanitizedComment,
      userId,
      answerId,
      parentCommentId,
    ]);
    const newCommentId = insertRows[0].comment_id;

    // Get recipients for notifications (answer owner and parent comment owner if different)
    const notificationRecipients = new Set();

    // Add answer owner if not the commenter
    if (answer[0].user_id !== userId) {
      const { rows: answerOwner } = await dbconnection.query(
        "SELECT user_email FROM registration WHERE user_id = $1",
        [answer[0].user_id]
      );
      if (answerOwner.length) {
        notificationRecipients.add(answerOwner[0].user_email);
      }
    }

    // Add parent comment owner if exists and different from commenter
    if (parentCommentId) {
      const { rows: parentComment } = await dbconnection.query(
        "SELECT user_id FROM comment WHERE comment_id = $1",
        [parentCommentId]
      );
      if (parentComment.length && parentComment[0].user_id !== userId) {
        const { rows: parentCommentOwner } = await dbconnection.query(
          "SELECT user_email FROM registration WHERE user_id = $1",
          [parentComment[0].user_id]
        );
        if (parentCommentOwner.length) {
          notificationRecipients.add(parentCommentOwner[0].user_email);
        }
      }
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Comment posted successfully",
      data: {
        comment_id: newCommentId,
        answer_id: answerId,
        parent_comment_id: parentCommentId,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to post comment due to server error",
    });
  }
}

module.exports = { postComment };
