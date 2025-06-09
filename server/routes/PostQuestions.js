const express = require('express')
const router = express.Router()

const { postQuestion} = require("../controller/postQuestion");


// Post a new question (protected route)
router.post("/ask", authMiddleware, postQuestion);



module.exports = router;