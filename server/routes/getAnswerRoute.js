const express = require("express");
const { getAnswer } = require("../controller/getAnswerController");


const getAnswerRouter=express.Router()

getAnswerRouter.get("/answer/:question_id",getAnswer)

module.exports=getAnswerRouter