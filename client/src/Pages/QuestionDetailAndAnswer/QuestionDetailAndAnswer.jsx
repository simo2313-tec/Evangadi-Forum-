import React, { useEffect, useState } from 'react'
import {useParams } from 'react-router-dom';
import styles from './questionDetailAndAnswer.module.css'
import Button from 'react-bootstrap/Button';
import { FaUserCircle } from "react-icons/fa";


function QuestionDetailAndAnswer() {


 const {question_id,user_id} = useParams()
 const [answer, setAnswer] = useState({
      user_id,
      question_id,
      answer:''
 })
 

 const [answersForQuestion, setAllQuestionAnswers] = useState([])


 let submitAnswer =(e)=>{
    e.preventDefault()
 }


 const handleChange = (e) => {
  const { name, value } = e.target;
  setAnswer((prev) => ({
    ...prev,
    [name]: value,
  }));
};
 
 
 

  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.first_div}>
          <h3 className={styles.title}>Question</h3>
          <p className={styles.Qtitle}>Question Title ...</p>
          <p>Question Detail...</p>
        </div>

        <div className={`mt-f container ${styles.second__div}`}>
          <hr />
          <h2 className={styles.title}>Answer From the Communicty </h2>
          <hr />
          {answersForQuestion?.map((answers, i) => {
            let listOfAnswers = (
              <div key={i} className="d-flex m-1">
                <div className={styles.avater}>
                  <FaUserCircle size={50} color="#888" />
                  <div>{user_name}</div>
                </div>
                <div className={styles.forAnswer}>
                  <p>{answer}</p>
                </div>
              </div>
            );
            return listOfAnswers;
          })}
        </div>

        <div className={`container mt-5 ${styles.third__div}`}>
          <h3 className={styles.title}>Answer the Top Question</h3>

          <form onSubmit={submitAnswer}>
            <textarea
              name="answers"
              id=""
              maxLength="115"
              placeholder="your answer here"
              onChange={handleChange}
            ></textarea>

            <div className={styles.btn}>
              <Button type="submit" variant="success">
                Submit Answer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


export default QuestionDetailAndAnswer