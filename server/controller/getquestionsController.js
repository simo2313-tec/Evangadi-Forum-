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

//! getSigleQuestion 
async function getSingleQuestion(req, res) {
  try {

    const { id } = req.params; //! Get question ID from the URL parameter

    const [questions] = await dbconnection.query(

      "SELECT q.*, r.user_name FROM question q JOIN registration r ON q.user_id=r.user_id WHERE q.question_id = ?",
      [id]
    );

    if (questions.length === 0) {

      return res

        .status(StatusCodes.NOT_FOUND) //!(404, not-found)

        .json({ message: "Question not found" });
    }
    res.status(StatusCodes.OK).json({ question: questions[0] }); //!(200, ok)

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR) //!(500,Internal Server Error)
      
      .json({ message: "Error retrieving question", error: error.message });
  }
}


module.exports = {getquestions,  getSingleQuestion};
