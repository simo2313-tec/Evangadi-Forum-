import React, { useContext, useState, useEffect } from "react";
import styles from "./home.module.css";
import axios from "../../Utility/axios";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { ClipLoader } from "react-spinners";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function Home() {
  const { userData, setUserData } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = userData?.token;

  const handleAskQuestion = () => {
    if (!token || !userData?.userid) {
      navigate("/landing", {
        state: { message: "Please login to ask a question" },
      });
    } else {
      navigate("/ask-questions");
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    // Fetch questions from the API
    axios
      .get("/question")
      .then((res) => {
        if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        } else {
          console.error("Unexpected data format:", res.data);
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        toast.error("Failed to load questions. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //  Vote handle
  const handleVote = async (question_id, action) => {
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await axios.post(`/questions/${question_id}/${action}`);
      const { likes, dislikes } = res.data;

      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === question_id ? { ...q, likes, dislikes } : q
        )
      );
    } catch (err) {
      console.error("Vote failed:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/landing");
      } else {
        toast.error("Could not cast vote. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <button onClick={handleAskQuestion} className={styles.Askbtn}>
                Ask Question
              </button>
              {/* Display welcome message with firstname, then username, then email prefix, then fallback */}
              <p>
                Welcome,{" "}
                {userData?.firstname ||
                  userData?.username ||
                  (userData?.email ? userData.email.split("@")[0] : null) ||
                  "User"}
                !
              </p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {loadingQuestions ? (
            <div className={styles.spinner_container}>
              <ClipLoader
                color={"var(--primary)"}
                loading={loadingQuestions}
                size={50}
              />
            </div>
          ) : questions.length === 0 ? (
            <p className={styles.no_questions_message}>
              No questions yet. Be the first to post a question!
            </p>
          ) : (
            questions.map((q) => (
              <div key={q.question_id} className={styles.question_item_wrapper}>
                <Link
                  to={`/question-detail/${q.question_id}`}
                  className={styles.link_container}
                >
                  <div className={styles.user_container}>
                    <div className={styles.user_question}>
                      <div className={styles.usericon_and_username}>
                        <div className={styles.inner_center}>
                          <FaUserCircle size={80} className={styles.usericon} />
                          <span>{q.user_name}</span>
                        </div>
                      </div>
                      <div>
                        <div className={styles.Qbox}>
                          <p className={styles.Qtitle}>{q.question_title}</p>
                          <p className={styles.timestamp_title}>
                            {getTimeDifference(q.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <FaChevronRight size={30} className={styles.chevron} />
                  </div>
                </Link>

                <div className={styles.vote_section}>
                  {/* Vote Buttons  */}
                  <VoteButtons
                    likes={q.likes ?? 0}
                    dislikes={q.dislikes ?? 0}
                    onVote={(action) => handleVote(q.question_id, action)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;
