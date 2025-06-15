import React, { useState, useEffect, useContext } from "react";
import styles from "./askQuestions.module.css";
import axios from "../../Utility/axios";
import { Link, useNavigate } from "react-router-dom";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { toast } from "react-toastify";

function AskQuestions() {
  const { userData, setUserData, loadingAuth } = useContext(UserContext);
  const token = userData?.token;
  const navigate = useNavigate();
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] =
    useState(false);

  const [question, setQuestion] = useState({
    title: "",
    description: "",
    userId: userData?.userid || null,
  });

  // Update question.userId if userData.userid changes after initial load
  useEffect(() => {
    if (userData?.userid) {
      setQuestion((prev) => ({ ...prev, userId: userData.userid }));
    }
  }, [userData?.userid]);

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingAuth) {
      return; // Wait for auth to load
    }

    if (!initialAuthCheckComplete) {
      if (!token || !userData?.userid) {
        navigate("/landing", {
          state: { message: "Please login to ask a question." }, // Message for Landing page
        });
      }
      setInitialAuthCheckComplete(true);
    } else {
      if (!token || !userData?.userid) {
        navigate("/landing");
      }
    }
  }, [
    token,
    userData?.userid,
    navigate,
    loadingAuth,
    initialAuthCheckComplete,
  ]);

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

    if (!token || !userData?.userid) {
      toast.error("Authentication required. Redirecting to login.");
      navigate("/landing", {
        state: { message: "Please login to ask a question." },
      });
      setLoading(false);
      return;
    }

    axios
      .post("/question", question, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/landing", {
            state: { message: "Session expired. Please log in again." },
          });
        } else {
          setError("Failed to submit question. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (response) {
    return (
      <div className={styles.success__msg}>
        <h1 className={styles.thanks_note}>{response.message}</h1>
        <Link className={styles.nav_to} to={"/home"}>
          {"Go to home"}
        </Link>
      </div>
    );
  }

  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.steps__container}>
          <h2>Steps to write a good question.</h2>
          <div className={styles.lists}>
            <ul>
              <li>Summarize your problem in one-line title.</li>
              <li>Describe your problem in more detail.</li>
              <li>Describe what you tried and what you expected to happen.</li>
              <li>Review your question and post it to the site.</li>
            </ul>
          </div>
        </div>

        <div className={`container mt-5 ${styles.question__container}`}>
          <h3 className={styles.title}>Ask a Public Question</h3>
          <Link to="/home">Go to Question page</Link>

          <form onSubmit={handleSubmit} className={styles.askform}>
            <input
              type="text"
              placeholder="Title"
              name="title"
              id="question_title"
              onChange={handleChange}
              value={question.title}
              required
            />

            <textarea
              placeholder="Question Description ..."
              name="description"
              id="question_description"
              onChange={handleChange}
              value={question.description}
              required
            ></textarea>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.askBtn}
              variant="success"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Your Question"}
            </button>
          </form>
        </div>
      </div>
    </LayOut>
  );
}

export default AskQuestions;
