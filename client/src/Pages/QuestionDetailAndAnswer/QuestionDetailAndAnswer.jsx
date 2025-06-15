// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import styles from "./questionDetailAndAnswer.module.css";
// import { FaUserCircle } from "react-icons/fa";
// import axios from "../../Utility/axios";
// import LayOut from "../../Components/Layout/Layout";
// import { UserContext } from "../../Components/Context/userContext";

// function QuestionDetailAndAnswer() {
//   const token = localStorage.getItem("token");
//   const [userData, setUserData] = useContext(UserContext);
//   const { question_id} = useParams();

//   const navigate = useNavigate()

//   const [answer, setAnswer] = useState({
//     user_id: userData?.userid,
//     question_id,
//     answer: "",
//   });

//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState({
//     getAnswerError: null,
//     getQuestionDetailError: null,
//     postAnswerError: null
//   });

//   const [answersForQuestion, setAllQuestionAnswers] = useState([]);
//   const [questionDetail, setQuestionDetail] = useState(null); 



//   const submitAnswer = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError({
//       ...error, postAnswerError: null,
//     });

//     axios
//       .post("/answer", answer, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//        console.log(res.data);
//         setResponse(res.data);
//       })
//       .catch((err) => {
//         const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//         setError((prev) => ({ ...prev, postAnswerError: errorMessage }));
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAnswer((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const getAllAnswers = () => {
//     setLoading(true);
//     setError({
//       ...error, getAnswerError: null
//     });
//     axios
//       .get(`/answer/${question_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setAllQuestionAnswers(res.data);
//       })
//       .catch((err) => {
//         const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//         console.log(errorMessage);
//         setError((prev) => ({ ...prev, getAnswerError: errorMessage }));
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const getQuestionDetail = () => {
//     setLoading(true);
//     setError({
//       ...error, getQuestionDetailError: null,
//     });
//     axios
//       .get(`/question/${question_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setQuestionDetail(res.data.question);
        
//       })
//       .catch((err) => {
//         const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//         console.log(errorMessage);
//         setError((prev) => ({ ...prev, getQuestionDetailError: errorMessage }));
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   // Load question detail and answers when component mounts
//   useEffect(() => {
//     getQuestionDetail();
//     getAllAnswers();
//   }, [question_id]);

  
//   if (response) {
//     return (
//       <div className={styles.success__msg}>
//         <h1 className={styles.thanks_note}>{response.message}</h1>
//         <Link className={styles.nav_to} to={"/home"}>
//           Go to home
//         </Link>
//       </div>
//     );
//   }
//   return (
//     <LayOut>
//       <div className={styles.outer__container}>
//         <div className={styles.theQuestion}>
//           <h3 className={styles.title}>Question</h3>

//           {questionDetail ? (
//             <> 
//               <p className={styles.Qtitle}>{questionDetail.question_title}</p>
//               <p>{questionDetail.question_description}</p>
//             </>
//           ) : (
//             <p>{error?.getQuestionDetailError}</p>
//           )}
//         </div>

//         <div className={styles.community_answer}>
//           <hr />
//           <h2 className={styles.title}>Answers From the Community</h2>
//           <hr />
//           <div className={styles.answers_container}>
//             {error.getAnswerError ? (
//               <p>{error?.getAnswerError}</p>) : answersForQuestion.length === 0 ? (
//               <p>No answers yet. Be the first to answer!</p>
//             ) : (
//               answersForQuestion.map((answerItem) => (
//                 <div key={answerItem.answer_id} className={styles.singleAnswer}>
//                   <div className={styles.user}>
//                     <FaUserCircle size={50} className={styles.usericon} />
//                     <div>{answerItem.user_name}</div>
//                   </div>
//                   <div className={styles.theAnswer}>
//                     <p>{answerItem.answer}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className={styles.answer__box}>
//           <h3 className={styles.title}>Answer the Top Question</h3>
//           <Link to="/home">Go to Question page</Link>
//           <form onSubmit={submitAnswer} className={styles.answerform}>
//             <textarea
//               name="answer"
//               id="answer"
//               placeholder="Your answer here"
//               onChange={handleChange}
//               value={answer.answer}
//               required
//             ></textarea>

//             {error?.postAnswerError && (
//               <p className={styles.error}>{error.postAnswerError}</p>
//             )}

//             <button
//               type="submit"
//               className={styles.answerBtn}
//               variant="success"
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Post your Answer"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </LayOut>
//   );
// }

// export default QuestionDetailAndAnswer;




// import React, { useContext, useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import styles from "./questionDetailAndAnswer.module.css";
// import { FaUserCircle } from "react-icons/fa";
// import axios from "../../Utility/axios";
// import LayOut from "../../Components/Layout/Layout";
// import { UserContext } from "../../Components/Context/userContext";
// import VoteButtons from "../../Components/VoteButtons/VoteButtons";
// import { toast } from "react-toastify";

// function QuestionDetailAndAnswer() {
//   const token = localStorage.getItem("token");
//   const [userData] = useContext(UserContext);
//   const { question_id } = useParams();

//   const [answer, setAnswer] = useState({
//     user_id: null,
//     question_id,
//     answer: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState({
//     fetchError: null,
//     postAnswerError: null,
//   });

//   const [answersForQuestion, setAllQuestionAnswers] = useState([]);
//   const [questionDetail, setQuestionDetail] = useState(null);

//   useEffect(() => {
//     if (userData) {
//       setAnswer((prev) => ({ ...prev, user_id: userData.userid }));
//     }
//   }, [userData]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError({ fetchError: null, postAnswerError: null });
//       try {
//         const [questionRes, answersRes] = await Promise.all([
//           axios.get(`/api/questions/${question_id}`),
//           axios.get(`/api/questions/${question_id}/answers`),
//         ]);
//         setQuestionDetail(questionRes.data.question);
//         setAllQuestionAnswers(answersRes.data);
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//         setError((prev) => ({ ...prev, fetchError: errorMessage }));
//         toast.error(errorMessage, {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [question_id]);

//   const handleVote = async (type, id, action) => {
//     if (!token) {
//       toast.error("Please log in to vote.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }
//     try {
//       const res = await axios.post(`/api/${type}s/${id}/${action}`);
//       const { likes, dislikes } = res.data;

//       if (type === "question") {
//         setQuestionDetail((prev) => ({ ...prev, likes, dislikes }));
//       } else if (type === "answer") {
//         setAllQuestionAnswers((prevAnswers) =>
//           prevAnswers.map((ans) =>
//             ans.answer_id === id ? { ...ans, likes, dislikes } : ans
//           )
//         );
//       }
//     } catch (err) {
//       console.error(`Failed to ${action} ${type}`, err);
//       toast.error(`Failed to ${action} ${type}.`, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleChange = (e) => {
//     setAnswer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const submitAnswer = async (e) => {
//     e.preventDefault();
//     if (!answer.answer.trim()) return;
//     if (!token || !userData) {
//       toast.error("Please log in to post an answer.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     const submitButton = e.currentTarget.querySelector("button");
//     submitButton.disabled = true;
//     submitButton.textContent = "Submitting...";

//     setError((prev) => ({ ...prev, postAnswerError: null }));

//     try {
//       const res = await axios.post(`/api/questions/${question_id}/answers`, answer);
//       setAllQuestionAnswers((prevAnswers) => [
//         { ...res.data, user_name: userData.username, likes: 0, dislikes: 0 },
//         ...prevAnswers,
//       ]);
//       setAnswer((prev) => ({ ...prev, answer: "" }));
//       toast.success("Answer posted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
//       setError((prev) => ({ ...prev, postAnswerError: errorMessage }));
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       submitButton.disabled = false;
//       submitButton.textContent = "Post your Answer";
//     }
//   };

//   if (loading && !questionDetail) {
//     return <LayOut><div>Loading...</div></LayOut>;
//   }

//   if (error.fetchError) {
//     return <LayOut><div>Error: {error.fetchError}</div></LayOut>;
//   }

//   return (
//     <LayOut>
//       <div className={styles.outer__container}>
//         <div className={styles.theQuestion}>
//           <h3 className={styles.title}>Question</h3>
//           {questionDetail ? (
//             <>
//               <p className={styles.Qtitle}>{questionDetail.question_title}</p>
//               <p>{questionDetail.question_description}</p>
//               <VoteButtons
//                 likes={questionDetail.likes}
//                 dislikes={questionDetail.dislikes}
//                 onVote={(action) => handleVote("question", questionDetail.question_id, action)}
//               />
//             </>
//           ) : (
//             <p>Question not found.</p>
//           )}
//         </div>

//         <div className={styles.community_answer}>
//           <hr />
//           <h2 className={styles.title}>Answers From the Community</h2>
//           <hr />
//           <div className={styles.answers_container}>
//             {answersForQuestion.length === 0 ? (
//               <p>No answers yet. Be the first to answer!</p>
//             ) : (
//               answersForQuestion.map((answerItem) => (
//                 <div key={answerItem.answer_id} className={styles.singleAnswer}>
//                   <div className={styles.user}>
//                     <FaUserCircle size={50} className={styles.usericon} />
//                     <div>{answerItem.user_name}</div>
//                   </div>
//                   <div className={styles.theAnswer}>
//                     <p>{answerItem.answer}</p>
//                     <VoteButtons
//                       likes={answerItem.likes}
//                       dislikes={answerItem.dislikes}
//                       onVote={(action) => handleVote("answer", answerItem.answer_id, action)}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className={styles.answer__box}>
//           <h3 className={styles.title}>Answer the Top Question</h3>
//           <Link to="/home">Go to Question page</Link>
//           <form onSubmit={submitAnswer} className={styles.answerform}>
//             <textarea
//               name="answer"
//               id="answer"
//               placeholder="Your answer here"
//               onChange={handleChange}
//               value={answer.answer}
//               required
//             ></textarea>
//             {error?.postAnswerError && <p className={styles.error}>{error.postAnswerError}</p>}
//             <button
//               type="submit"
//               className={styles.answerBtn}
//               disabled={!userData || !token}
//             >
//               Post your Answer
//             </button>
//           </form>
//         </div>
//       </div>
//     </LayOut>
//   );
// }

// export default QuestionDetailAndAnswer;


import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context/userContext";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function QuestionDetailAndAnswer() {
  const token = localStorage.getItem("token");
  const [userData] = useContext(UserContext);
  const { question_id } = useParams();
  const questionIdNum = parseInt(question_id);

  const [answer, setAnswer] = useState({
    user_id: null,
    question_id: questionIdNum,
    answer: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    fetchError: null,
    postAnswerError: null,
  });

  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [questionDetail, setQuestionDetail] = useState(null);

  useEffect(() => {
    if (userData?.userid) {
      setAnswer((prev) => ({ ...prev, user_id: userData.userid }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError({ fetchError: null, postAnswerError: null });
      try {
        const [questionRes, answersRes] = await Promise.all([
          axios.get(`/api/questions/${question_id}`),
          axios.get(`/api/questions/${question_id}/answers`),
        ]);
        setQuestionDetail(questionRes.data.question);
        setAllQuestionAnswers(answersRes.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
        setError((prev) => ({ ...prev, fetchError: errorMessage }));
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    if (question_id) fetchData();
  }, [question_id]);

  const handleVote = async (type, id, action) => {
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await axios.post(`/api/${type}s/${id}/${action}`);
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
    setAnswer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.answer.trim()) {
      toast.error("Answer cannot be empty.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!token || !userData?.userid || !answer.user_id) {
      toast.error("Please log in to post an answer.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (isNaN(answer.question_id)) {
      toast.error("Invalid question ID.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const submitButton = e.currentTarget.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    setError((prev) => ({ ...prev, postAnswerError: null }));

    try {
      console.log("Sending payload:", {
        answer: answer.answer,
        user_id: answer.user_id,
        question_id: answer.question_id,
      });
      const res = await axios.post(`/api/questions/${question_id}/answers`, {
        answer: answer.answer,
        user_id: answer.user_id,
        question_id: answer.question_id,
      });
      console.log("Response:", res.data);
      setAllQuestionAnswers((prevAnswers) => [
        {
          answer_id: res.data.answerId,
          answer: answer.answer,
          user_name: userData.username,
          likes: 0,
          dislikes: 0,
        },
        ...prevAnswers,
      ]);
      setAnswer((prev) => ({ ...prev, answer: "" }));
      toast.success("Answer posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      console.error("Post answer error:", err.response?.data || err);
      setError((prev) => ({ ...prev, postAnswerError: errorMessage }));
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Post your Answer";
    }
  };

  if (loading && !questionDetail) {
    return <LayOut><div>Loading...</div></LayOut>;
  }

  if (error.fetchError) {
    return <LayOut><div>Error: {error.fetchError}</div></LayOut>;
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
              <VoteButtons
                likes={questionDetail.likes}
                dislikes={questionDetail.dislikes}
                onVote={(action) => handleVote("question", questionDetail.question_id, action)}
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
            {answersForQuestion.length === 0 ? (
              <p>No answers yet. Be the first to answer!</p>
            ) : (
              answersForQuestion.map((answerItem) => (
                <div key={answerItem.answer_id} className={styles.singleAnswer}>
                  <div className={styles.user}>
                    <FaUserCircle size={50} className={styles.usericon} />
                    <div>{answerItem.user_name}</div>
                  </div>
                  <div className={styles.theAnswer}>
                    <p>{answerItem.answer}</p>
                    <VoteButtons
                      likes={answerItem.likes}
                      dislikes={answerItem.dislikes}
                      onVote={(action) => handleVote("answer", answerItem.answer_id, action)}
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
              value={answer.answer}
              required
            ></textarea>
            {error?.postAnswerError && <p className={styles.error}>{error.postAnswerError}</p>}
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