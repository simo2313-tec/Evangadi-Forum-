const express = require("express");
const getAnswerComments = require("../controller/getAnswerCommentsController");

const getAnswerCommentsRouter = express.Router();

getAnswerCommentsRouter.get("/comment/:answer_id", getAnswerComments);

module.exports = getAnswerCommentsRouter;
