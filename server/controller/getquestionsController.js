const dbconnection = require("../db/db.Config");
const { StatusCodes } = require("http-status-codes");

async function getquestions(req, res) {
  try {
    const [question] = await dbconnection.query(
      "SELECT q.*, r.user_name FROM question q JOIN registration r ON q.user_id=r.user_id"
    );
    res.status(StatusCodes.ACCEPTED).json({ question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error retrieving question", error: error.message });
  }
}

module.exports = { getquestions };
