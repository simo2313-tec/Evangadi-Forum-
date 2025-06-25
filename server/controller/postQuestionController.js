const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/db.Config");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");

async function postQuestion(req, res) {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user?.userid; // Assuming user ID is stored in req.user

    // Validate required fields
    if (!title || !description || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title, description, and user-ID are required",
      });
    }

    // Validate tag length (max 20 chars per schema)
    if (tag && tag.length > 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Tag must be 20 characters or less",
      });
    }

    // Sanitize inputs to prevent XSS
    const sanitizedTitle = xss(title);
    const sanitizedDescription = xss(description);
    const sanitizedTag = tag ? xss(tag) : null;

    // Generate a unique UUID for the question
    const questionUuid = uuidv4();

    // Insert question into database
    const [result] = await dbconnection.query(
      "INSERT INTO question (question_title, question_description, tag, user_id, question_uuid) VALUES (?, ?, ?, ?, ?)",
      [sanitizedTitle, sanitizedDescription, sanitizedTag, userId, questionUuid]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully",
      questionId: result.insertId,
    });
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error posting question",
      error: error.message,
    });
  }
}

module.exports = { postQuestion };
