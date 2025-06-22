const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const xss = require("xss");

async function deleteComment(req, res) {
  // Validate authentication
  if (!req.user?.userid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { commentId } = req.params;
  const userId = req.user.userid;
  const commentIdNum = parseInt(commentId, 10);

  // Validate comment ID
  if (!commentId || isNaN(commentIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Valid comment ID is required",
    });
  }

  try {
    // Begin transaction
    await dbconnection.query("START TRANSACTION");

    // Verify comment exists and get basic info
    const [comment] = await dbconnection.query(
      `SELECT user_id, answer_id 
       FROM comment 
       WHERE comment_id = ? 
       FOR UPDATE`, // Lock row for update
      [commentIdNum]
    );

    if (!comment.length) {
      await dbconnection.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization
    if (comment[0].user_id !== userId) {
      await dbconnection.query("ROLLBACK");
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    // First delete child comments (replies)
    await dbconnection.query(
      `DELETE FROM comment 
       WHERE parent_comment_id = ?`,
      [commentIdNum]
    );

    // Then delete the main comment
    await dbconnection.query(
      `DELETE FROM comment 
       WHERE comment_id = ?`,
      [commentIdNum]
    );

    // Commit transaction
    await dbconnection.query("COMMIT");

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment and its replies deleted successfully",
      data: {
        comment_id: commentIdNum,
        answer_id: comment[0].answer_id,
        deleted_replies: true
      }
    });

  } catch (error) {
    await dbconnection.query("ROLLBACK");
    console.error("Database error deleting comment:", {
      error: error.message,
      stack: error.stack,
      sql: error.sql,
      params: { commentId, userId }
    });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete comment due to server error",
      system_message: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

async function updateComment(req, res) {
  // Validate authentication
  if (!req.user?.userid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { commentId } = req.params;
  const { comment_text } = req.body;
  const userId = req.user.userid;
  const commentIdNum = parseInt(commentId, 10);

  // Validate inputs
  if (!commentId || isNaN(commentIdNum)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Valid comment ID is required",
    });
  }

  if (!comment_text?.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Comment text cannot be empty",
    });
  }

  // Sanitize input
  const sanitizedComment = xss(comment_text.trim());

  try {
    // Begin transaction
    await dbconnection.query("START TRANSACTION");

    // Verify comment exists and get basic info
    const [comment] = await dbconnection.query(
      `SELECT user_id, answer_id 
       FROM comment 
       WHERE comment_id = ? 
       FOR UPDATE`, // Lock row for update
      [commentIdNum]
    );

    if (!comment.length) {
      await dbconnection.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization
    if (comment[0].user_id !== userId) {
      await dbconnection.query("ROLLBACK");
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Unauthorized to edit this comment",
      });
    }

    // Update comment
    const [result] = await dbconnection.query(
      `UPDATE comment 
       SET comment_text = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE comment_id = ?`,
      [sanitizedComment, commentIdNum]
    );

    // Verify update was successful
    if (result.affectedRows === 0) {
      await dbconnection.query("ROLLBACK");
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update comment",
      });
    }

    // Commit transaction
    await dbconnection.query("COMMIT");

    // Get the updated comment
    const [updatedComment] = await dbconnection.query(
      `SELECT comment_id, comment_text, created_at, updated_at 
       FROM comment 
       WHERE comment_id = ?`,
      [commentIdNum]
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment[0]
    });

  } catch (error) {
    await dbconnection.query("ROLLBACK");
    console.error("Database error updating comment:", {
      error: error.message,
      stack: error.stack,
      sql: error.sql,
      params: { commentId, userId }
    });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update comment due to server error",
      system_message: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

module.exports = { deleteComment, updateComment };