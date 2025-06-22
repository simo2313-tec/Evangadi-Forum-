const express = require("express");
const { deleteComment, updateComment } = require("../controller/updateCommentController"); // Fixed import
const updateCommentRouter = express.Router(); 

updateCommentRouter.delete("/comment/:commentId", deleteComment);
updateCommentRouter.put("/comment/:commentId", updateComment);

module.exports = updateCommentRouter;