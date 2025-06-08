import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styles from "./askQuestions.module.css";
import axios from "../../Utility/axios";
import { Link } from "react-router-dom";

function AskQuestions() {
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState({
    question_title: "",
    question_description: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios
      .post("/user/questions", question, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch(() => {
        setError("Failed to submit question. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
    <div className={styles.outer__container}>
      <div className={styles.steps__container}>
        <h2>Steps to write a good question.</h2>
        <ul>
          <li>Summarize your problem in one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>

      <div className={`container mt-5 ${styles.question__container}`}>
        <h3 className={styles.title}>Ask a Public Question</h3>
        <Link to="/home">Go to Question page</Link>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            name="question_title"
            id="question_title"
            onChange={handleChange}
            value={question.question_title}
            required
          />

          <textarea
            maxLength={250}
            placeholder="Question Description ..."
            name="question_description"
            id="question_description"
            onChange={handleChange}
            value={question.question_description}
            required
          ></textarea>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.btn}>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Posting..." : "Post Your Question"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskQuestions;
