import React from "react";
import styles from "./home.module.css";
import { useState, useEffect } from "react";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout"

function Home() {
  // State for storing questions from the API
  const [questions, setQuestions] = useState([]);
  // Added state to store user data from localStorage
  const [user, setUser] = useState(null);
  // Added useNavigate hook for redirecting users
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage to check if user is logged in
    const userData = JSON.parse(localStorage.getItem("user"));
    // If no user data found, redirect to login page
    if (!userData) {
      navigate("/login");
      return;
    }
    // Store user data in state for display
    setUser(userData);

    // Fetch questions from the API
    axios
      .get("users/all-question")
      .then((res) => {
        console.log(res.data.question);
        setQuestions(res.data.question);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        // If unauthorized (401), redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
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
              <Link to="/ask-questions" className={styles.btn}>
                <p>Ask Question</p>
              </Link>
              {/* Display actual username from user state, fallback to "User" if not available */}
              <p>Welcome: {user?.username || "User"}</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {questions.map((q) => (
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
                    <p className={styles.title}>{q.question_title}</p>
                  </div>
                  <FaChevronRight size={20} className={styles.chevron} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;
