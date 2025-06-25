const express = require("express");
const {
  deleteQuestion,
  editQuestion,
} = require("../controller/updateQuestionController");

const updateQuestionRouter = express.Router();

updateQuestionRouter.delete("/:question_uuid", deleteQuestion);
updateQuestionRouter.put("/:question_uuid", editQuestion);

module.exports = updateQuestionRouter;
