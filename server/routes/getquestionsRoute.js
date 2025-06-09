const express = require('express')
const {getquestions} = require("../controller/getquestionsController");

const getQuestionRouter = express.Router()


getQuestionRouter.get("/all-question", getquestions);

module.exports = getQuestionRouter;

