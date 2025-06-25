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

  const client = await dbconnection.connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    // Verify comment exists and get basic info
    const { rows: comment } = await client.query(
      `SELECT user_id, answer_id 
       FROM comment 
       WHERE comment_id = $1 
       FOR UPDATE`,
      [commentIdNum]
    );

    if (!comment.length) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization
    if (comment[0].user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    // First delete child comments (replies)
    await client.query(
      `DELETE FROM comment 
       WHERE parent_comment_id = $1`,
      [commentIdNum]
    );

    // Then delete the main comment
    await client.query(
      `DELETE FROM comment 
       WHERE comment_id = $1`,
      [commentIdNum]
    );

    // Commit transaction
    await client.query("COMMIT");

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
    await client.query("ROLLBACK");
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
  } finally {
    client.release();
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

  const client = await dbconnection.connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    // Verify comment exists and get basic info
    const { rows: comment } = await client.query(
      `SELECT user_id, answer_id 
       FROM comment 
       WHERE comment_id = $1 
       FOR UPDATE`,
      [commentIdNum]
    );

    if (!comment.length) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization
    if (comment[0].user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Unauthorized to edit this comment",
      });
    }

    // Update comment
    const result = await client.query(
      `UPDATE comment 
       SET comment_text = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE comment_id = $2`,
      [sanitizedComment, commentIdNum]
    );

    // Verify update was successful
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update comment",
      });
    }

    // Commit transaction
    await client.query("COMMIT");

    // Get the updated comment
    const { rows: updatedComment } = await client.query(
      `SELECT comment_id, comment_text, created_at, updated_at 
       FROM comment 
       WHERE comment_id = $1`,
      [commentIdNum]
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");
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
  } finally {
    client.release();
  }
}

module.exports = { deleteComment, updateComment };