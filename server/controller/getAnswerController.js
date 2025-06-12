const dbconnection = require("../db/db.Config");

async function getAnswer(req, res) {
  const questionId = req.params.question_id;
  try {
    const query = `
        SELECT 
          answer.*,
          
          registration.user_name,
          profile.first_name,
          profile.last_name
        FROM answer
        INNER JOIN question ON answer.question_id = question.question_id
        INNER JOIN registration ON answer.user_id = registration.user_id
        LEFT JOIN profile ON registration.user_id = profile.user_id
        WHERE answer.question_id =?
      `;

    const [result] = await dbconnection.query(query, [questionId]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

module.exports = { getAnswer };
