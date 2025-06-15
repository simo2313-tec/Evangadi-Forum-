// const express = require("express");
// const { getAnswer } = require("../controller/getAnswerController");


// const getAnswerRouter=express.Router()

// getAnswerRouter.get("/answer/:question_id",getAnswer)

// module.exports=getAnswerRouter


const express = require("express");
const { getAnswer } = require("../controller/getAnswerController");

const getAnswerRouter = express.Router();

getAnswerRouter.get("/questions/:question_id/answers", getAnswer);

module.exports = getAnswerRouter;