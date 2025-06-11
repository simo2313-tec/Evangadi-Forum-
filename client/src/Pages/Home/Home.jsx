import React from "react";
import styles from "./home.module.css";
import { useState, useEffect } from "react";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout"

function Home() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    axios
      .get("users/all-question")
      .then((res) => {
        console.log(res.data.question);
        setQuestions(res.data.question);
      })
      .catch((err) => console.error("Failed to fetch questions:", err));
  }, []);
  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <Link to="/" className={styles.btn}>
                <p>Ask Question</p>
              </Link>
              {/* get user name from state */}
              <p>Welcome: username</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {questions.map((q) => (
            <Link
              to={`/question-detail/${q.question_id}`}
              className={styles.link_container}
            >
              <div key={q.question_id}>
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
