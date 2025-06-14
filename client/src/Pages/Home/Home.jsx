import React, { useContext } from "react";
import styles from "./home.module.css";
import { useState, useEffect } from "react";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout"
import { UserContext } from "../../Components/Context/userContext";

function Home() {
  const [userData, setUserData] = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
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
      });
  }, [navigate]); // Added navigate to dependency array

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
              {/* Display actual username from user state, fallback to "User" if not available */}
              <p>Welcome: {userData?.username || "User"}</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {questions.length === 0 ? (
            <p>No questions yet. Be the first to post a question!</p>
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
                      <p className={styles.Qtitle}>{q.question_title}</p>
                    </div>
                    <FaChevronRight size={20} className={styles.chevron} />
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
