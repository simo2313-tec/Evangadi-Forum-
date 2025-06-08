import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styles from "./askQuestions.module.css";

function AskQuestions() {
  const [question, setQuestion] = useState({
    question_title: "",
    question_description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className={styles.first__div}>
        <h3>Steps to write a good question.</h3>
        <ul>
          <li>Summarize your problem in one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </div>
      <div className={`container mt-5 ${styles.second__div}`}>
        <h3 className={styles.title}>Ask a Public Question</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Question Title"
            name="question_title"
            id="question_title"
            onChange={handleChange}
            value={question.question_title}
          />

          <textarea
            maxLength="250"
            placeholder="Question detail"
            name="question_description"
            onChange={handleChange}
            value={question.question_description}
          ></textarea>

          <div className={styles.btn}>
            <Button type="submit" variant="success">
              Post Your Question
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AskQuestions;
