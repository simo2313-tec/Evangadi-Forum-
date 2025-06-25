const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

// Edit Question Endpoint
async function editQuestion(req, res) {
  const { question_uuid } = req.params;
  const { title, description, tag } = req.body;
  const user_id = req.user.userid;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Question title and description are required" });
  }

  try {
    // Verify question exists and belongs to user
    const [question] = await dbconnection.query(
      "SELECT user_id FROM question WHERE question_uuid = ?",
      [question_uuid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Question not found" });
    }

    if (question[0].user_id !== user_id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to edit this question" });
    }

    // Update question
    await dbconnection.query(
      "UPDATE question SET question_title = ?, question_description = ?, tag = ? WHERE question_uuid = ?",
      [title, description, tag || null, question_uuid]
    );
    res.json({ message: "Question updated successfully" });
  } catch (error) {
    console.error("Error editing question:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

// Delete Question Endpoint
async function deleteQuestion(req, res) {
  const { question_uuid } = req.params;
  const user_id = req.user.userid;

  try {
    // Verify question exists and belongs to user
    const [question] = await dbconnection.query(
      "SELECT user_id FROM question WHERE question_uuid = ?",
      [question_uuid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Question not found" });
    }

    if (question[0].user_id !== user_id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Not authorized to delete this question" });
    }

    // Delete question (answers will be deleted via ON DELETE CASCADE if configured)
    await dbconnection.query("DELETE FROM question WHERE question_uuid = ?", [
      question_uuid,
    ]);

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

module.exports = {
  editQuestion,
  deleteQuestion,
};
