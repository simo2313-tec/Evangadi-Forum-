const express = require("express");
const { getAnswers } = require("../controller/getAnswerController");

const getAnswerRouter = express.Router();

getAnswerRouter.get("/answer/:question_uuid", getAnswers);

module.exports = getAnswerRouter;
