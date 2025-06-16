// const express = require('express')
// const { postQuestion } = require("../controller/postQuestionController");


// const postQuestionRouter = express.Router()

// // Post a new question (protected route)
// postQuestionRouter.post("/question", postQuestion);



// module.exports = postQuestionRouter;


const express = require("express");
const { postQuestion } = require("../controller/postQuestionController");

const postQuestionRouter = express.Router();

postQuestionRouter.post("/questions", postQuestion);

module.exports = postQuestionRouter;