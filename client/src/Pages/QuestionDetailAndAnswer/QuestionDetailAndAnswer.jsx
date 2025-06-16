import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function QuestionDetailAndAnswer() {
  const { userData, setUserData } = useContext(UserContext);
  const token = userData?.token;
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
  const [successAnswer, setSuccessAnswer] = useState(false)

  const submitAnswer = (e) => {
    console.log(answer);
    e.preventDefault();
     setLoading(true);
    setError({
      ...error,
      postAnswerError: null,
    });
   
    if(!token){
      setLoading(false)
      toast.error("Login to post answer");
      return;
    }

   
    axios
      .post("/answer", answer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
        getAllAnswers();
        setSuccessAnswer(true)
        toast.success("Answer Posted Successfully")
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

 
  // Vote handler
  const handleVote = async (type, id, action) => {
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await axios.post(`/${type}s/${id}/${action}`);
      const { likes, dislikes } = res.data;

      if (type === "question") {
        setQuestionDetail((prev) => ({ ...prev, likes, dislikes }));
      } else if (type === "answer") {
        setAllQuestionAnswers((prevAnswers) =>
          prevAnswers.map((ans) =>
            ans.answer_id === id ? { ...ans, likes, dislikes } : ans
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${action} ${type}`, err);
      toast.error(`Failed to ${action} ${type}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleChange = (e) => {
    setSuccessAnswer(false)
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
        setAllQuestionAnswers(res.data);
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
  }, [question_id, successAnswer]);
  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.theQuestion}>
          <h3 className={styles.title}>Question</h3>
          {questionDetail ? (
            <>
              <p className={styles.Qtitle}>{questionDetail.question_title}</p>
              <p>{questionDetail.question_description}</p>
              {/* voteButtons  */}
              <VoteButtons
                likes={questionDetail.likes}
                dislikes={questionDetail.dislikes}
                onVote={(action) =>
                  handleVote("question", questionDetail.question_id, action)
                }
              />
            </>
          ) : (
            <p>Question not found.</p>
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
                    {/* VoteButtons */}
                    <VoteButtons
                      likes={answerItem.likes}
                      dislikes={answerItem.dislikes}
                      onVote={(action) =>
                        handleVote("answer", answerItem.answer_id, action)
                      }
                    />
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
              value={successAnswer ? "" : answer.answer}
              required
            ></textarea>
            {error?.postAnswerError && (
              <p className={styles.error}>{error.postAnswerError}</p>
            )}
            <button
              type="submit"
              className={styles.answerBtn}
              disabled={!userData || !token}
            >
              Post your Answer
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
