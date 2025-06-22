import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./questionDetailAndAnswer.module.css";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "../../Utility/axios";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

function QuestionDetailAndAnswer() {
  const { userData, setUserData } = useContext(UserContext);
  const token = userData?.token;
  const { question_id } = useParams();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState({
    user_id: userData?.userid,
    question_id,
    answer: "",
  });

  const [loading, setLoading] = useState(false);
  const [editQuestionMode, setEditQuestionMode] = useState(false);
  const [editAnswerMode, setEditAnswerMode] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [filterYourAnswers, setFilterYourAnswers] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [loadingQuestionDetail, setLoadingQuestionDetail] = useState(false);
  const [error, setError] = useState({
    getAnswerError: null,
    getQuestionDetailError: null,
  });
  const [answersForQuestion, setAllQuestionAnswers] = useState([]);
  const [answerPage, setAnswerPage] = useState(1);
  const [answerPageSize] = useState(10);
  const [answerPagination, setAnswerPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [questionDetail, setQuestionDetail] = useState(null);
  const [successAnswer, setSuccessAnswer] = useState(false);
  const [answerSort, setAnswerSort] = useState("recent");

  // Comment related states
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editCommentMode, setEditCommentMode] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [errorComment, setErrorComment] = useState(null);

  const hasUserAnswers = answersForQuestion.some(
    (ans) => ans.user_id === userData?.userid
  );

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

  // Post a new comment - FIXED endpoint and auth
  const handleCommentSubmit = async (answerId, parentCommentId = null) => {
    if (!token) {
      toast.error("Please log in to post a comment");
      navigate("/login");
      return;
    }

    const commentText = newComment[`${answerId}-text`]?.trim();
    if (!commentText) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoadingComment(true);
    try {
      const payload = {
        answer_id: answerId,
        comment_text: commentText,
        parent_comment_id: parentCommentId,
      };

      await axios.post("/comment", payload);
      toast.success("Comment posted successfully");
      setNewComment((prev) => ({
        ...prev,
        [`${answerId}-text`]: "",
      }));
      fetchComments(answerId);
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoadingComment(false);
    }
  };

  // Edit a comment - FIXED endpoint
  const handleEditComment = async (answerId, commentId) => {
    if (!token) {
      toast.error("Please log in to edit comment");
      navigate("/login");
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

      setComments((prev) => {
        const updatedComments = { ...prev };
        updatedComments[answerId] = updatedComments[answerId].map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, comment_text: editedComment }
            : comment
        );
        return updatedComments;
      });

      setEditCommentMode(null);
      setEditedComment("");
      toast.success("Comment updated successfully");
    } catch (err) {
      console.error("Failed to edit comment:", err);
      toast.error(err.response?.data?.message || "Failed to edit comment");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoadingComment(false);
    }
  };

  // Delete a comment - FIXED endpoint
  const handleDeleteComment = async (answerId, commentId) => {
    if (!token) {
      toast.error("Please log in to delete comment");
      navigate("/login");
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
      setComments((prev) => {
        const updatedComments = { ...prev };
        updatedComments[answerId] = updatedComments[answerId].filter(
          (comment) => comment.comment_id !== commentId
        );
        return updatedComments;
      });
      toast.success("Comment deleted successfully");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error(err.response?.data?.message || "Failed to delete comment");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoadingComment(false);
    }
  };

  // Render nested comments
  const renderComments = (commentList, answerId, depth = 0) => {
    if (!commentList || commentList.length === 0) return null;

    const commentMap = {};
    const commentTree = [];

    commentList.forEach((comment) => {
      commentMap[comment.comment_id] = { ...comment, children: [] };
    });

    commentList.forEach((comment) => {
      if (comment.parent_comment_id && commentMap[comment.parent_comment_id]) {
        commentMap[comment.parent_comment_id].children.push(
          commentMap[comment.comment_id]
        );
      } else {
        commentTree.push(commentMap[comment.comment_id]);
      }
    });

    const renderCommentNode = (comment, commentDepth) => {
      return (
        <div
          key={comment.comment_id}
          className={styles.comment}
          style={{ marginLeft: `${commentDepth * 20}px` }}
        >
          <div className={styles.comment_header}>
            <FaUserCircle size={30} className={styles.comment_usericon} />
            <span className={styles.comment_username}>
              {comment.user_id === userData?.userid
                ? "You"
                : `@${comment.user_name}`}
            </span>
            <span className={styles.comment_timestamp}>
              {getTimeDifference(comment.created_at)}
            </span>
          </div>

          {editCommentMode === comment.comment_id ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditComment(answerId, comment.comment_id);
              }}
              className={styles.comment_form}
            >
              <textarea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className={styles.comment_textarea}
                required
              />
              <div className={styles.form_actions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={loadingComment}
                >
                  {loadingComment ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditCommentMode(null)}
                  disabled={loadingComment}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className={styles.comment_text}>{comment.comment_text}</p>
              <div className={styles.comment_actions}>
                <VoteButtons
                  likes={comment.likes || 0}
                  dislikes={comment.dislikes || 0}
                  userVote={comment.user_vote_type}
                  onVote={(action) =>
                    handleVote("comment", comment.comment_id, action)
                  }
                />

                {comment.user_id === userData?.userid && (
                  <div className={styles.edit_delete_buttons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setEditCommentMode(comment.comment_id);
                        setEditedComment(comment.comment_text);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        handleDeleteComment(answerId, comment.comment_id)
                      }
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}

                <button
                  className={styles.reply_button}
                  onClick={() =>
                    setNewComment((prev) => ({
                      ...prev,
                      [answerId]: `reply-${comment.comment_id}`,
                    }))
                  }
                >
                  Reply
                </button>
              </div>
            </>
          )}

          {newComment[answerId] === `reply-${comment.comment_id}` && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(answerId, comment.comment_id);
              }}
              className={styles.comment_form}
            >
              <textarea
                value={newComment[`${answerId}-text`] || ""}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    [`${answerId}-text`]: e.target.value,
                  }))
                }
                className={styles.comment_textarea}
                placeholder="Write your reply..."
                required
              />
              <div className={styles.form_actions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={loadingComment}
                >
                  {loadingComment ? "Posting..." : "Post Reply"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() =>
                    setNewComment((prev) => ({
                      ...prev,
                      [answerId]: null,
                      [`${answerId}-text`]: "",
                    }))
                  }
                  disabled={loadingComment}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {comment.children.length > 0 && (
            <div className={styles.comment_children}>
              {comment.children.map((child) =>
                renderCommentNode(child, commentDepth + 1)
              )}
            </div>
          )}
        </div>
      );
    };

    return commentTree.map((comment) => renderCommentNode(comment, depth));
  };

  // Fetch question details
  const getQuestionDetail = async () => {
    setLoadingQuestionDetail(true);
    setError({ ...error, getQuestionDetailError: null });
    try {
      const res = await axios.get(`/question/${question_id}`);
      setQuestionDetail(res.data.question);
      setEditedQuestion({
        title: res.data.question.question_title,
        description: res.data.question.question_description || "",
        tag: res.data.question.tag || "",
      });
    } catch (err) {
      console.error("Failed to fetch question details", err);
      toast.error("Failed to fetch question details");
    } finally {
      setLoadingQuestionDetail(false);
    }
  };

  // Fetch answers - FIXED endpoint
  const getAllAnswers = async () => {
    setLoadingAnswers(true);
    setError({ ...error, getAnswerError: null });
    try {
      const res = await axios.get(
        `/answer/${question_id}?page=${answerPage}&pageSize=${answerPageSize}&sort=${answerSort}`
      );
      if (Array.isArray(res.data.answers)) {
        setAllQuestionAnswers(res.data.answers);
        setAnswerPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            pageSize: 5,
            totalPages: 1,
          }
        );

        res.data.answers.forEach((answer) => {
          fetchComments(answer.answer_id);
        });
      } else {
        setAllQuestionAnswers([]);
        setAnswerPagination({
          total: 0,
          page: 1,
          pageSize: 5,
          totalPages: 1,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setError((prev) => ({ ...prev, getAnswerError: errorMessage }));
      setAllQuestionAnswers([]);
      setAnswerPagination({
        total: 0,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      });
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Post answer - FIXED endpoint
  const submitAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      setLoading(false);
      toast.error("Login to post answer");
      navigate("/login");
      return;
    }
    try {
      await axios.post("/answer", {
        answer: answer.answer,
        question_id: answer.question_id,
      });
      getAllAnswers();
      setSuccessAnswer(true);
      setAnswer({ ...answer, answer: "" });
      toast.success("Answer Posted Successfully");
    } catch (err) {
      console.error("Error posting answer:", err);
      toast.error(err.response?.data?.message || "Failed to post answer");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit question - FIXED endpoint
  const handleEditQuestion = async () => {
    if (!token) {
      toast.error("Please log in to edit the question.");
      navigate("/login");
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
      await axios.put(`/question/${question_id}`, editedQuestion);
      setQuestionDetail((prev) => ({ ...prev, ...editedQuestion }));
      setEditQuestionMode(false);
      toast.success("Question updated successfully.");
    } catch (err) {
      console.error("Failed to edit question", err);
      toast.error(err.response?.data?.error || "Failed to edit question.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Delete question - FIXED endpoint
  const handleDeleteQuestion = async () => {
    if (!token) {
      toast.error("Please log in to delete the question.");
      navigate("/login");
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
      await axios.delete(`/question/${question_id}`);
      toast.success("Question deleted successfully.");
      navigate("/home");
    } catch (err) {
      console.error("Failed to delete question", err);
      toast.error(err.response?.data?.error || "Failed to delete question.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Edit answer - FIXED endpoint
  const handleEditAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to edit the answer.");
      navigate("/login");
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
      toast.success("Answer updated successfully.");
    } catch (err) {
      console.error("Failed to edit answer", err);
      toast.error(err.response?.data?.error || "Failed to edit answer.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Delete answer - FIXED endpoint
  const handleDeleteAnswer = async (answerId) => {
    if (!token) {
      toast.error("Please log in to delete the answer.");
      navigate("/login");
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
      toast.success("Answer deleted successfully.");
    } catch (err) {
      console.error("Failed to delete answer", err);
      toast.error(err.response?.data?.error || "Failed to delete answer.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Handle input changes for new answer
  const handleChange = (e) => {
    setSuccessAnswer(false);
    const { name, value } = e.target;
    setAnswer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for editing question
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle filter for user's answers
  const handleFilterYourAnswers = () => {
    setFilterYourAnswers((prev) => !prev);
    setAnswerPage(1);
  };

  // Vote handler
  const handleVote = async (type, id, action) => {
    if (!token) {
      toast.error("Please log in to vote.");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(`/${type}s/${id}/${action}`);
      const { likes, dislikes } = res.data;
      if (type === "question") {
        setQuestionDetail((prev) => ({ ...prev, likes, dislikes }));
      } else if (type === "answer") {
        setAllQuestionAnswers((prevAnswers) =>
          prevAnswers.map((ans) =>
            ans.answer_id === id ? { ...ans, likes, dislikes } : ans
          )
        );
      } else if (type === "comment") {
        setComments((prev) => {
          const newComments = { ...prev };
          Object.keys(newComments).forEach((answerId) => {
            newComments[answerId] = newComments[answerId].map((comment) =>
              comment.comment_id === id
                ? { ...comment, likes, dislikes }
                : comment
            );
          });
          return newComments;
        });
      }
      toast.success("Vote recorded successfully.");
    } catch (err) {
      console.error(`Failed to ${action} ${type}`, err);
      toast.error(`Failed to ${action} ${type}.`);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Filter answers based on filterYourAnswers state
  const displayedAnswers = filterYourAnswers
    ? answersForQuestion.filter((ans) => ans.user_id === userData?.userid)
    : answersForQuestion;

  // Load question detail and answers when component mounts
  useEffect(() => {
    getQuestionDetail();
    getAllAnswers();
  }, [
    question_id,
    successAnswer,
    answerPage,
    answerPageSize,
    answerSort,
    editQuestionMode,
  ]);

  // Update answer state when userData changes
  useEffect(() => {
    setAnswer((prev) => ({
      ...prev,
      user_id: userData?.userid,
    }));
  }, [userData?.userid]);

  return (
    <LayOut>
      <div className={styles.outer__container}>
        <div className={styles.theQuestion}>
          <h3 className={styles.title}>Question</h3>
          {loadingQuestionDetail ? (
            <div className={styles.loading_container}>
              <ClipLoader
                color={"var(--primary)"}
                loading={loadingQuestionDetail}
                size={50}
              />
            </div>
          ) : questionDetail ? (
            <>
              {editQuestionMode ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditQuestion();
                  }}
                  className={styles.editQuestionForm}
                >
                  <input
                    type="text"
                    name="title"
                    value={editedQuestion.title}
                    onChange={handleQuestionChange}
                    placeholder="Question title"
                    required
                  />
                  <textarea
                    name="description"
                    value={editedQuestion.description}
                    onChange={handleQuestionChange}
                    placeholder="Question description"
                  />
                  <input
                    type="text"
                    name="tag"
                    value={editedQuestion.tag}
                    onChange={handleQuestionChange}
                    placeholder="Tag"
                  />
                  <div>
                    <button className={styles.saveBtn} type="submit">
                      Save
                    </button>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setEditQuestionMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className={styles.Qtitle}>
                    {questionDetail.question_title}
                  </p>
                  <p>{questionDetail.question_description}</p>
                  <p>
                    Asked by{" "}
                    {questionDetail.user_id === userData?.userid
                      ? "you"
                      : "@" + questionDetail.user_name}
                  </p>
                  {questionDetail.user_id === userData?.userid && (
                    <div className={styles.edit_delete_buttons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditQuestionMode(true)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={handleDeleteQuestion}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                  <VoteButtons
                    likes={questionDetail.likes}
                    dislikes={questionDetail.dislikes}
                    userVote={questionDetail.user_vote_type}
                    onVote={(action) =>
                      handleVote("question", questionDetail.question_id, action)
                    }
                  />
                </>
              )}
            </>
          ) : (
            <p>{error?.getQuestionDetailError}</p>
          )}
        </div>

        <div className={styles.community_answer}>
          <hr />
          <div className={styles.questions_sort_row}>
            <h2 className={styles.title}>Answers From the Community</h2>
            <div className={styles.sort_container}>
              <label htmlFor="answer-sort-select" className={styles.sort_label}>
                Sort by:
              </label>
              <select
                id="answer-sort-select"
                className={styles.sort_select}
                value={answerSort}
                onChange={(e) => {
                  setAnswerSort(e.target.value);
                  setAnswerPage(1);
                }}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          <hr />
          <div>
            {hasUserAnswers && (
              <button
                className={styles.filter_btn}
                onClick={handleFilterYourAnswers}
                disabled={!token}
              >
                {filterYourAnswers ? "Show All Answers" : "Your Answers"}
              </button>
            )}
          </div>
          <div className={styles.answers_container}>
            {loadingAnswers ? (
              <div className={styles.loading_container}>
                <ClipLoader
                  color={"var(--primary)"}
                  loading={loadingAnswers}
                  size={50}
                />
              </div>
            ) : error.getAnswerError ? (
              <p>{error?.getAnswerError}</p>
            ) : displayedAnswers.length === 0 ? (
              <p>
                {questionDetail?.user_id === userData?.userid
                  ? "Your question has no answers yet."
                  : "This question has no answers yet."}
              </p>
            ) : (
              <>
                {displayedAnswers.map((answerItem) => (
                  <div
                    key={answerItem.answer_id}
                    className={styles.question_item_wrapper}
                  >
                    <div className={styles.user_container}>
                      <div className={styles.user_question}>
                        <div className={styles.usericon_and_username}>
                          <div className={styles.inner_center}>
                            <FaUserCircle
                              size={80}
                              className={styles.usericon}
                              style={{
                                background: "var(--white)",
                                color: "#1e3a5f",
                                borderRadius: "50%",
                                padding: "5px",
                              }}
                            />
                            <span>
                              {answerItem.user_id === userData?.userid
                                ? "You"
                                : "@" + answerItem.user_name}
                            </span>
                          </div>
                        </div>

                        {editAnswerMode === answerItem.answer_id ? (
                          <form
                            className={styles.editAnswerForm}
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleEditAnswer(answerItem.answer_id);
                            }}
                          >
                            <textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              required
                            />
                            <div>
                              <button className={styles.saveBtn} type="submit">
                                Save
                              </button>
                              <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => {
                                  setEditAnswerMode(null);
                                  setEditedAnswer("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className={styles.Qbox}>
                            <p className={styles.Qtitle}>{answerItem.answer}</p>
                            <p className={styles.timestamp_title}>
                              {getTimeDifference(answerItem.created_at)}
                            </p>
                            {answerItem.user_id === userData?.userid && (
                              <div className={styles.edit_delete_buttons}>
                                <button
                                  className={styles.editBtn}
                                  onClick={() => {
                                    setEditAnswerMode(answerItem.answer_id);
                                    setEditedAnswer(answerItem.answer);
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className={styles.deleteBtn}
                                  onClick={() =>
                                    handleDeleteAnswer(answerItem.answer_id)
                                  }
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.vote_section}>
                        <VoteButtons
                          likes={answerItem.likes}
                          dislikes={answerItem.dislikes}
                          userVote={answerItem.user_vote_type}
                          onVote={(action) =>
                            handleVote("answer", answerItem.answer_id, action)
                          }
                        />
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className={styles.comments_section}>
                      <h4 className={styles.comment_title}>Comments</h4>
                      {comments[answerItem.answer_id]?.length > 0 ? (
                        renderComments(
                          comments[answerItem.answer_id],
                          answerItem.answer_id
                        )
                      ) : (
                        <p>No comments yet.</p>
                      )}

                      {/* Add Comment Form */}
                      <form
                        className={styles.comment_form}
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleCommentSubmit(answerItem.answer_id);
                        }}
                      >
                        <textarea
                          className={styles.comment_textarea}
                          value={
                            newComment[`${answerItem.answer_id}-text`] || ""
                          }
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [`${answerItem.answer_id}-text`]: e.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                          required
                        />
                        <div className={styles.form_actions}>
                          <button
                            type="submit"
                            className={styles.comment_submit_button}
                            disabled={loadingComment}
                          >
                            {loadingComment ? "Posting..." : "Add Comment"}
                          </button>
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() =>
                              setNewComment((prev) => ({
                                ...prev,
                                [`${answerItem.answer_id}-text`]: "",
                              }))
                            }
                            disabled={loadingComment}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ))}
                <div className={styles.pagination_container}>
                  <button
                    className={styles.pagination_btn}
                    onClick={() => setAnswerPage((p) => Math.max(1, p - 1))}
                    disabled={answerPage === 1}
                  >
                    Previous
                  </button>
                  <span className={styles.pagination_info}>
                    Page {answerPagination.page} of{" "}
                    {answerPagination.totalPages}
                  </span>
                  <button
                    className={styles.pagination_btn}
                    onClick={() =>
                      setAnswerPage((p) =>
                        Math.min(answerPagination.totalPages, p + 1)
                      )
                    }
                    disabled={answerPage === answerPagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.answer__box}>
          <div className={styles.answer_form_container}>
            <h3 className={styles.title}>Answer the Question</h3>
            <form onSubmit={submitAnswer} className={styles.answer_form}>
              <textarea
                name="answer"
                id="answer"
                cols="30"
                rows="5"
                placeholder="Write your answer here..."
                onChange={handleChange}
                value={answer.answer}
                required
              ></textarea>
              <button
                type="submit"
                className={styles.answerBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader color={"#fff"} loading={loading} size={20} />
                    <span style={{ marginLeft: "10px" }}>Posting . . .</span>
                  </>
                ) : (
                  "Post Your Answer"
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
