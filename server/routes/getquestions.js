const express = require('express')
const dbconnection = require('../db/db.Config')
const router = express.Router()
const {StatusCodes} = require('http-status-codes')

// router.get("/all-questions", authMiddleware, (req, res)=>{
//     res.send ("all questions")
// })
router.get("/all-question", async(req, res)=>{
    try{
        const [questions]= await dbconnection.query("SELECT q.questions_id, q.question_title, q.question_discription, q.tag, q.user+id, r.user_name, FROM question q JOIN registration r ON q.user_id=r.user_id")
        res.status(StatusCodes.ACCEPTED).json({questions})
    }catch (error){
        res.status(500).json({message: "error retrieving question", error:error.message})
    }
})

module.exports= router

