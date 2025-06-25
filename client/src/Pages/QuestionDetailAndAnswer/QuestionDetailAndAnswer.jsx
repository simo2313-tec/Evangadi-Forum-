import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import Question from "../../Components/Question/Question";
import Answer from "../../Components/Answer/Answer";

function QuestionDetailAndAnswer() {
  const { userData } = useContext(UserContext);
  const token = userData?.token;
  const { question_uuid } = useParams();
  const navigate = useNavigate();
  const answerFormRef = useRef(null);

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [editQuestionMode, setEditQuestionMode] = useState(false);
  const [editAnswerMode, setEditAnswerMode] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [questionDetail, setQuestionDetail] = useState(null);

  const [answerSort, setAnswerSort] = useState("recent");
  const [filterYourAnswers, setFilterYourAnswers] = useState(false);

  // Comment related states
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editCommentMode, setEditCommentMode] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const scrollToAnswerForm = () => {
    answerFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch comments for an answer
  const fetchComments = async (answerId) => {
    try {
      const res = await axios.get(`/comment/${answerId}`);
      setComments((prev) => ({
        ...prev,
        [answerId]: res.data.comments || [],
      }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments((prev) => ({
        ...prev,
        [answerId]: [],
      }));
    }
  };

  // Post a new comment
  const handleCommentSubmit = async (answerId, parentCommentId = null) => {
    if (!token) {
      toast.error("Please log in to post a comment");
      return;
    }

    const commentText = newComment[`${answerId}-text`]?.trim();
    if (!commentText) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoadingComment(true);
    try {
      await axios.post("/comment", {
        answer_id: answerId,
        comment_text: commentText,
        parent_comment_id: parentCommentId,
      });
      setNewComment((prev) => ({
        ...prev,
        [`${answerId}-text`]: "",
      }));
      fetchComments(answerId);
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setLoadingComment(false);
    }
  };

  // Edit a comment
  const handleEditComment = async (answerId, commentId) => {
    if (!token) {
      toast.error("Please log in to edit comment");
      return;
    }

    if (!editedComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoadingComment(true);
    try {
      await axios.put(`/comment/${commentId}`, {
        comment_text: editedComment,
      });
      setEditCommentMode(null);
      setEditedComment("");
      fetchComments(answerId);
    } catch (err) {
      console.error("Failed to edit comment:", err);
      toast.error(err.response?.data?.message || "Failed to edit comment");
    } finally {
      setLoadingComment(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (answerId, commentId) => {
    if (!token) {
      toast.error("Please log in to delete comment");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setLoadingComment(true);
    try {
      await axios.delete(`/comment/${commentId}`);
      fetchComments(answerId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setLoadingComment(false);
    }
  };

  // Fetch question details
  const fetchQuestionDetail = async () => {
    setLoadingQuestion(true);
    try {
      const res = await axios.get(`/question/${question_uuid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestionDetail(res.data.question);
      setEditedQuestion(res.data.question);
    } catch (err) {
      console.error("Failed to fetch question detail:", err);
      toast.error(err.response?.data?.message || "Failed to load question");
      // navigate("/404");
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Fetch all answers for the current question
  const fetchAllAnswersForQuestion = async () => {
    setLoadingAnswers(true);
    try {
      const res = await axios.get(`/answer/${question_uuid}`, {
        params: {
          sort: answerSort,
          filter_user: filterYourAnswers ? userData.userid : undefined,
        },
      });
      const answers = res.data.answers || [];
      setAllQuestionAnswers(answers);
      answers.forEach((answer) => fetchComments(answer.answer_id));
    } catch (err) {
      console.error("Failed to fetch answers:", err);
      toast.error(err.response?.data?.message || "Failed to load answers");
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Post answer
  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Login to post answer");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/answer", { answer, question_uuid });
      setAnswer("");
      fetchAllAnswersForQuestion();
    } catch (err) {
      console.error("Error posting answer:", err);
      toast.error(err.response?.data?.message || "Failed to post answer");
    } finally {
      setLoading(false);
    }
  };

  // Edit question
  const handleEditQuestion = async () => {
    if (!token) {
      toast.error("Please log in to edit the question.");
      return;
    }
    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update this question?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });
    if (!result.isConfirmed) return;

    try {
      const updatePayload = {
        title: editedQuestion.question_title,
        description: editedQuestion.question_description,
        tag: editedQuestion.tag,
      };
      await axios.put(`/question/${question_uuid}`, updatePayload);
      setQuestionDetail((prev) => ({
        ...prev,
        question_title: editedQuestion.question_title,
        question_description: editedQuestion.question_description,
        tag: editedQuestion.tag,
      }));
      setEditQuestionMode(false);
    } catch (err) {
      console.error("Failed to edit question", err);
      toast.error(err.response?.data?.error || "Failed to edit question.");
      if (err.response?.status === 401) {
      }
    }
  };

  // Delete question
  const handleDeleteQuestion = async () => {
    if (!token) {
      toast.error("Please log in to delete the question.");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/question/${question_uuid}`);
      navigate("/home");
    } catch (err) {
      console.error("Failed to delete question", err);
      toast.error(err.response?.data?.error || "Failed to delete question.");
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  // Edit answer
  const handleEditAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to edit the answer.");
      return;
    }
    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update this answer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.put(`/answer/${answerId}`, { answer: editedAnswer });
      setAllQuestionAnswers((prev) =>
        prev.map((ans) =>
          ans.answer_id === answerId ? { ...ans, answer: editedAnswer } : ans
        )
      );
      setEditAnswerMode(null);
      setEditedAnswer("");
    } catch (err) {
      console.error("Failed to edit answer", err);
      toast.error(err.response?.data?.error || "Failed to edit answer.");
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  // Delete answer
  const handleDeleteAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to delete the answer.");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/answer/${answerId}`);
      setAllQuestionAnswers((prev) =>
        prev.filter((ans) => ans.answer_id !== answerId)
      );
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[answerId];
        return newComments;
      });
    } catch (err) {
      console.error("Failed to delete answer", err);
      toast.error(err.response?.data?.error || "Failed to delete answer.");
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  // Vote on an answer
  const handleVote = async (itemType, itemId, voteType) => {
    if (!token) {
      toast.error("Please log in to vote.");
      return;
    }

    try {
      const url = `/${itemType}s/${itemId}/${voteType}`;
      const res = await axios.post(url);
      const { likes, dislikes } = res.data;

      if (itemType === "answer") {
        setAllQuestionAnswers((prevAnswers) =>
          prevAnswers.map((ans) => {
            if (ans.answer_id === itemId) {
              const newVoteType = voteType === "like" ? "up" : "down";
              return { ...ans, likes, dislikes, user_vote_type: newVoteType };
            }
            return ans;
          })
        );
      } else if (itemType === "question") {
        setQuestionDetail((prev) => {
          if (prev.question_id === itemId) {
            const newVoteType = voteType === "like" ? "up" : "down";
            return { ...prev, likes, dislikes, user_vote_type: newVoteType };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to vote:", err);
      toast.error(err.response?.data?.message || "Failed to record vote.");
    }
  };

  // Helper function to find which answer a comment belongs to
  const findAnswerIdForComment = (commentId) => {
    for (const answerId in comments) {
      if (comments[answerId].some((c) => c.comment_id === commentId)) {
        return answerId;
      }
    }
    return null;
  };

  useEffect(() => {
    if (question_uuid) {
      fetchQuestionDetail();
    }
  }, [question_uuid, token]);

  useEffect(() => {
    if (question_uuid) {
      fetchAllAnswersForQuestion();
    }
  }, [question_uuid, token, answerSort, filterYourAnswers]);

  const filteredAnswers = useMemo(() => {
    if (filterYourAnswers) {
      return answersForQuestion.filter(
        (ans) => ans.user_id === userData?.userid
      );
    }
    return answersForQuestion;
  }, [answersForQuestion, filterYourAnswers, userData?.userid]);

  return (
    <LayOut>
      <div className={styles.container}>
        {loadingQuestion ? (
          <div className={styles.spinner_container}>
            <ClipLoader color="#007bff" />
            <p>Loading question...</p>
          </div>
        ) : editQuestionMode ? (
          <div className={styles.edit_question_container}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditQuestion();
              }}
              className={styles.edit_question_form}
            >
              <input
                type="text"
                value={editedQuestion?.question_title || ""}
                onChange={(e) =>
                  setEditedQuestion((prev) => ({
                    ...prev,
                    question_title: e.target.value,
                  }))
                }
                className={styles.edit_question_input}
                placeholder="Question Title"
              />
              <textarea
                value={editedQuestion?.question_description || ""}
                onChange={(e) =>
                  setEditedQuestion((prev) => ({
                    ...prev,
                    question_description: e.target.value,
                  }))
                }
                className={styles.edit_question_textarea}
                placeholder="Question Description"
              />
              <input
                type="text"
                value={editedQuestion?.tag || ""}
                onChange={(e) =>
                  setEditedQuestion((prev) => ({
                    ...prev,
                    tag: e.target.value,
                  }))
                }
                className={styles.edit_question_input}
                placeholder="Tag"
              />
              <div className={styles.edit_question_buttons}>
                <button type="submit" className={styles.save_question_btn}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditQuestionMode(false)}
                  className={styles.cancel_edit_btn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : questionDetail ? (
          <Question
            questionDetail={questionDetail}
            handleDeleteQuestion={handleDeleteQuestion}
            setEditQuestionMode={setEditQuestionMode}
            scrollToAnswerForm={scrollToAnswerForm}
            handleVote={handleVote}
          />
        ) : (
          <div className={styles.spinner_container}>
            <ClipLoader color="#007bff" />
          </div>
        )}

        <div className={styles.answers_section}>
          <div className={styles.answers_header}>
            <h1 className={styles.community_answer_title}>
              Answers From The Community
            </h1>
            <div className={styles.answer_controls}>
              <button
                className={styles.filter_btn}
                onClick={() => setFilterYourAnswers((prev) => !prev)}
              >
                {filterYourAnswers ? "All Answers" : "My Answers"}
              </button>
              <div className={styles.sort_container}>
                <label
                  htmlFor="answer-sort-select"
                  className={styles.sort_label}
                >
                  Sort by:
                </label>
                <select
                  id="answer-sort-select"
                  className={styles.sort_select}
                  value={answerSort}
                  onChange={(e) => setAnswerSort(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.answers_container}>
            {loadingAnswers ? (
              <div className={styles.spinner_container}>
                <ClipLoader color={"var(--primary)"} />
                <p>Loading answers...</p>
              </div>
            ) : filteredAnswers.length > 0 ? (
              filteredAnswers.map((answerItem) => (
                <Answer
                  key={answerItem.answer_id}
                  answer={answerItem}
                  handleEditAnswer={handleEditAnswer}
                  handleDeleteAnswer={handleDeleteAnswer}
                  handleVote={handleVote} // Pass the unified handleVote
                  editAnswerMode={editAnswerMode}
                  editedAnswer={editedAnswer}
                  setEditedAnswer={setEditedAnswer}
                  setEditAnswerMode={setEditAnswerMode}
                  comments={comments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handleCommentSubmit={handleCommentSubmit}
                  editCommentMode={editCommentMode}
                  setEditCommentMode={setEditCommentMode}
                  editedComment={editedComment}
                  setEditedComment={setEditedComment}
                  handleEditComment={handleEditComment}
                  handleDeleteComment={handleDeleteComment}
                  loadingComment={loadingComment}
                />
              ))
            ) : (
              <p className={styles.no_answers_message}>
                No answers found for this question.
              </p>
            )}
          </div>

          <div ref={answerFormRef} className={styles.add_answer_section}>
            <h3>Post Your Answer</h3>
            <form onSubmit={submitAnswer} className={styles.answer_form}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer..."
                className={styles.answer_textarea}
                required
              />
              <button
                type="submit"
                className={styles.submit_btn}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  "Post Answer"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default QuestionDetailAndAnswer;
