import React from "react";
import styles from "./home.module.css";
import { useState, useEffect } from "react";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout"

function Home() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);

    // Fetch questions
    axios
      .get("users/all-question")
      .then((res) => {
        console.log(res.data.question);
        setQuestions(res.data.question);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <Link to="/ask-questions" className={styles.btn}>
                <p>Ask Question</p>
              </Link>
              <p>Welcome: {user?.username || "User"}</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {questions.map((q) => (
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
