import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/";
import {
  FaUserCircle,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "./Answer.module.css";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../VoteButtons/VoteButtons";
import Comment from "../Comment/Comment";

function Answer({
  answer,
  handleEditAnswer,
  handleDeleteAnswer,
  editAnswerMode,
  editedAnswer,
  setEditedAnswer,
  setEditAnswerMode,
  handleVote,
  comments,
  newComment,
  setNewComment,
  handleCommentSubmit,
  editCommentMode,
  setEditCommentMode,
  editedComment,
  setEditedComment,
  handleEditComment,
  handleDeleteComment,
  loadingComment,
}) {
  const { userData } = useContext(UserContext);
  const [isReplying, setIsReplying] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);

  const handlePostComment = (e) => {
    e.preventDefault();
    handleCommentSubmit(answer.answer_id);
    setIsReplying(false);
  };

  const toggleReplies = () => {
    setIsRepliesVisible(!isRepliesVisible);
  };

  return (
    <div className={styles.answer_container}>
      <div className={styles.main_content}>
        <div className={styles.answer_header}>
          <FaUserCircle size={40} className={styles.user_icon} />
          <div className={styles.answer_meta}>
            <span className={styles.username}>
              <Link
                to={`/profile/${answer.user_uuid}`}
                className={styles.author_link}
              >
                @{answer.user_name}
              </Link>
              {userData?.userid === answer.user_id && " (You)"}
            </span>
            <span className={styles.timestamp}>
              {getTimeDifference(answer.created_at)}
            </span>
          </div>
        </div>

        {editAnswerMode === answer.answer_id ? (
          <div className={styles.edit_answer_form}>
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className={styles.edit_textarea}
            />
            <div className={styles.edit_actions}>
              <button
                onClick={() => handleEditAnswer(answer.answer_id)}
                className={styles.save_btn}
              >
                Save
              </button>
              <button
                onClick={() => setEditAnswerMode(null)}
                className={styles.cancel_btn}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.answer_text}>{answer.answer}</p>
        )}

        <div className={styles.answer_footer}>
          <div className={styles.answer_actions}>
            {userData?.userid === answer.user_id && (
              <>
                <button
                  onClick={() => {
                    setEditAnswerMode(answer.answer_id);
                    setEditedAnswer(answer.answer);
                  }}
                  className={styles.action_btn}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteAnswer(answer.answer_id)}
                  className={`${styles.action_btn} ${styles.delete_btn}`}
                >
                  <MdDelete /> Delete
                </button>
              </>
            )}
            {!isReplying && (
              <button
                className={`${styles.action_btn} ${styles.reply_button}`}
                onClick={() => setIsReplying(true)}
              >
                Reply
              </button>
            )}
          </div>
          <div className={styles.view_replies_container}>
            <button onClick={toggleReplies} className={styles.view_replies_btn}>
              {isRepliesVisible ? <FaChevronUp /> : <FaChevronDown />}
              <span>
                {isRepliesVisible ? "Hide Replies" : "View Replies"} (
                {comments[answer.answer_id]?.length || 0})
              </span>
            </button>
          </div>
        </div>

        {isReplying && (
          <form onSubmit={handlePostComment} className={styles.comment_form}>
            <textarea
              value={newComment[`${answer.answer_id}-text`] || ""}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  [`${answer.answer_id}-text`]: e.target.value,
                }))
              }
              className={styles.comment_textarea}
              placeholder="Add a reply..."
              required
            />
            <div className={styles.form_actions}>
              <button
                type="submit"
                className={styles.save_btn}
                disabled={loadingComment}
              >
                {loadingComment ? "Submitting..." : "Post Reply"}
              </button>
              <button
                type="button"
                className={styles.cancel_btn}
                onClick={() => setIsReplying(false)}
                disabled={loadingComment}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isRepliesVisible && (
          <div className={styles.comments_section}>
            <Comment
              comments={comments[answer.answer_id]}
              answerId={answer.answer_id}
              answerAuthor={answer.user_name}
              answerAuthorUUID={answer.user_uuid}
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
          </div>
        )}
      </div>
      <div className={styles.vote_container}>
        <VoteButtons
          likes={answer.likes}
          dislikes={answer.dislikes}
          userVote={answer.user_vote_type}
          onVote={(action) => handleVote("answer", answer.answer_id, action)}
        />
      </div>
    </div>
  );
}

export default Answer;
