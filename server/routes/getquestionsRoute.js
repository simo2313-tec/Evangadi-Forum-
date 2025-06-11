const express = require('express')
const { getquestions, getSingleQuestion } = require('../controller/getquestionsController'); // Updated path and destructuring


const getQuestionRouter = express.Router();


getQuestionRouter.get("/all-question", getquestions);
getQuestionRouter.get('/question/:id', getSingleQuestion) //! "get sigle questins"

module.exports = getQuestionRouter;









