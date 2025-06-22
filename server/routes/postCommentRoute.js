const express = require("express");
const { postComment } = require("../controller/postCommentController");

const postCommentRouter = express.Router();


postCommentRouter.post("/comment", postComment); 

module.exports = postCommentRouter;