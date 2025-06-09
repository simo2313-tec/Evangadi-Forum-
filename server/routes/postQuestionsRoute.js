const express = require('express')
const { postQuestion } = require("../controller/postQuestionController");


const postQuestionRouter = express.Router()



// Import the authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Post a new question (protected route)
postQuestionRouter.post("/ask", postQuestion);



module.exports = postQuestionRouter;