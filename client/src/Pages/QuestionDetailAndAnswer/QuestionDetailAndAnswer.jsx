import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context/userContext";

function QuestionDetailAndAnswer() {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useContext(UserContext);
  const { question_id } = useParams();

  const navigate = useNavigate();

  const [answer, setAnswer] = useState({
    user_id: userData?.userid,
    question_id,
    answer: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    getAnswerError: null,
    getQuestionDetailError: null,
    postAnswerError: null,
  });

  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [questionDetail, setQuestionDetail] = useState(null);

  const submitAnswer = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      ...error,
      postAnswerError: null,
    });

    axios
      .post("/answer", answer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setResponse(res.data);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        setError((prev) => ({ ...prev, postAnswerError: errorMessage }));
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
    setError({
      ...error,
      getAnswerError: null,
    });
    axios
      .get(`/answer/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllQuestionAnswers(res.data.answers);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        console.log(errorMessage);
        setError((prev) => ({ ...prev, getAnswerError: errorMessage }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getQuestionDetail = () => {
    setLoading(true);
    setError({
      ...error,
      getQuestionDetailError: null,
    });
    axios
      .get(`/question/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setQuestionDetail(res.data.question);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong";
        console.log(errorMessage);
        setError((prev) => ({ ...prev, getQuestionDetailError: errorMessage }));
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

  // For Timestamp

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  function getTimeDifference(pastTime) {
    const currentTime = new Date(); // current time
    const diffMs = currentTime - new Date(pastTime); // in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return formatter.format(-diffSeconds, "second");
    if (diffMinutes < 60) return formatter.format(-diffMinutes, "minute");
    if (diffHours < 24) return formatter.format(-diffHours, "hour");
    return formatter.format(-diffDays, "day");
  }

  if (response) {
    return (
      <div className={styles.success__msg}>
        <h1 className={styles.thanks_note}>{response.message}</h1>
        <Link className={styles.nav_to} to={"/home"}>
          Go to home
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
            <p>{error?.getQuestionDetailError}</p>
          )}
        </div>

        <div className={styles.community_answer}>
          <hr />
          <h2 className={styles.title}>Answers From the Community</h2>
          <hr />
          <div className={styles.answers_container}>
            {error.getAnswerError ? (
              <p>{error?.getAnswerError}</p>
            ) : answersForQuestion.length === 0 ? (
              <p>No answers yet. Be the first to answer!</p>
            ) : (
              answersForQuestion.map((answerItem) => (
                <div key={answerItem.answer_id} className={styles.singleAnswer}>
                  <div className={styles.user}>
                    <FaUserCircle size={50} className={styles.usericon} />
                    <div>{answerItem.user_name}</div>
                  </div>
                  <div className={styles.theAnswer}>
                    <div className={styles.eachAnswer}>
                      <p>{answerItem.answer}</p>
                      <p className={styles.timestamp_title}>
                        {getTimeDifference(answerItem.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.answer__box}>
          <h3 className={styles.title}>Answer the Top Question</h3>
          <Link to="/home">Go to Question page</Link>
          <form onSubmit={submitAnswer} className={styles.answerform}>
            <textarea
              name="answer"
              id="answer"
              placeholder="Your answer here"
              onChange={handleChange}
              value={answer.answer}
              required
            ></textarea>

            {error?.postAnswerError && (
              <p className={styles.error}>{error.postAnswerError}</p>
            )}

            <button
              type="submit"
              className={styles.answerBtn}
              variant="success"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Post your Answer"}
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
