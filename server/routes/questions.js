const express = require('express')
const router = express.Router()

router.get('/allquestions', authMiddleware, (req, res)=>{
    res.send ("all questions")
})

module.exports= router

