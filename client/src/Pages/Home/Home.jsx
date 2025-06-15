import React, { useContext, useState, useEffect } from "react";
import styles from "./home.module.css";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { ClipLoader } from "react-spinners";
import getTimeDifference from "../../Utility/helpers";

function Home() {
  const { userData, setUserData } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const navigate = useNavigate();

  // handler for Ask Question button
  const handleAskQuestion = () => {
    if (!userData?.userid) {
      // redirect with message
      navigate("/landing", {
        state: { message: "Please login to ask question" },
      });
    } else {
      // user logged in, go to ask question page
      navigate("/ask-questions");
    }
  };

  useEffect(() => {
    setLoadingQuestions(true); // Set loading to true when fetching starts
    // Fetch questions from the API
    axios
      .get("/question")
      .then((res) => {
        setQuestions(res.data.question);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        // If unauthorized (401), redirect to login
        if (err.response?.status === 401) {
          navigate("/landing");
        }
      })
      .finally(() => {
        setLoadingQuestions(false); // Set loading to false when fetching finishes (success or error)
      });
  }, [navigate]);

  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              {/* Changed route from "/" to "/ask-questions" to fix navigation */}
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
              // Added key prop to the Link component for proper React list rendering
              <Link
                key={q.question_id}
                to={`/question-detail/${q.question_id}`}
                className={styles.link_container}
              >
                <div>
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
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;
