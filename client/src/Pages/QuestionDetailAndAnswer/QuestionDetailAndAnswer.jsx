import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import Button from "react-bootstrap/Button";
import { FaUserCircle } from "react-icons/fa";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";

function QuestionDetailAndAnswer() {
  const token = localStorage.getItem("token");
  const { question_id, user_id } = useParams();

  const [answer, setAnswer] = useState({
    user_id,
    question_id,
    answer: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [questionDetail, setQuestionDetail] = useState(null); 

  const submitAnswer = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios
      .post("/user/answer", answer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch(() => {
        setError("Failed to submit answer. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAllAnswers = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`/user/getAllAnswers/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllQuestionAnswers(res.data);
      })
      .catch(() => {
        setError("Failed to get all answers. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getQuestionDetail = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`/user/getQuestionDetail/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setQuestionDetail(res.data);
      })
      .catch(() => {
        setError("Failed to load question detail. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Load question detail and answers when component mounts
  useEffect(() => {
    getQuestionDetail();
    getAllAnswers();
  }, [question_id]);

  
  if (response) {
    return (
      <div className={styles.success__msg}>
        <h1 className={styles.thanks_note}>{response.messageToTheFront}</h1>
        <Link className={styles.nav_to} to={response.navigation}>
          {response.messageToUser}
        </Link>
      </div>
    );
  }

  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.theQuestion}>
          <h3 className={styles.title}>Question</h3>

          {questionDetail ? (
            <>
              <p className={styles.Qtitle}>{questionDetail.question_title}</p>
              <p>{questionDetail.question_description}</p>
            </>
          ) : (
            <p>Loading question...</p>
          )}
        </div>

        <div className={`mt-5 container ${styles.community_answer}`}>
          <hr />
          <h2 className={styles.title}>Answers From the Community</h2>
          <hr />
          {answersForQuestion.length === 0 ? (
            <p>No answers yet. Be the first to answer!</p>
          ) : (
            answersForQuestion.map((answerItem) => (
              <div key={answerItem.answer_id} className="d-flex my-5">
                <div className={styles.avater}>
                  <FaUserCircle size={50} color="#888" />
                  <div>{answerItem.user_name}</div>
                </div>
                <div className={styles.forAnswer}>
                  <p>{answerItem.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`container mt-5 ${styles.answer__box}`}>
          <h3 className={styles.title}>Answer the Top Question</h3>
          <Link to="/home">Go to Question page</Link>
          <form onSubmit={submitAnswer}>
            <textarea
              name="answer"
              id="answer"
              maxLength="115"
              placeholder="Your answer here"
              onChange={handleChange}
              value={answer.answer}
              required
            ></textarea>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.btn}>
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
