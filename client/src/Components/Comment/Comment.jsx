import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "./Comment.module.css";
import getTimeDifference from "../../Utility/helpers";

function Comment({
  comments,
  answerId,
  answerAuthor,
  answerAuthorUUID, // Add this prop
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

  const renderComments = (commentList) => {
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

    const renderCommentNode = (comment, commentMap) => {
      const parentComment = comment.parent_comment_id
        ? commentMap[comment.parent_comment_id]
        : null;

      return (
        <div key={comment.comment_id} className={styles.comment}>
          <div className={styles.comment_header}>
            <FaUserCircle size={30} className={styles.comment_usericon} />
            <span className={styles.comment_username}>
              <Link
                to={`/profile/${comment.user_uuid}`}
                className={styles.author_link}
              >
                @{comment.user_name}
              </Link>
              {comment.user_id === userData?.userid && " (You)"}
              {parentComment ? (
                <>
                  <span className={styles.reply_to_text}> to </span>
                  <Link
                    to={`/profile/${parentComment.user_uuid}`}
                    className={styles.author_link}
                  >
                    @{parentComment.user_name}
                  </Link>
                </>
              ) : (
                answerAuthor && (
                  <>
                    <span className={styles.reply_to_text}> to </span>
                    <Link
                      to={`/profile/${answerAuthorUUID}`}
                      className={styles.author_link}
                    >
                      @{answerAuthor}
                    </Link>
                  </>
                )
              )}
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
                {comment.user_id === userData?.userid && (
                  <>
                    <button
                      className={styles.action_btn}
                      onClick={() => {
                        setEditCommentMode(comment.comment_id);
                        setEditedComment(comment.comment_text);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className={`${styles.action_btn} ${styles.deleteBtn}`}
                      onClick={() =>
                        handleDeleteComment(answerId, comment.comment_id)
                      }
                    >
                      <MdDelete /> Delete
                    </button>
                  </>
                )}

                <button
                  className={`${styles.action_btn} ${styles.reply_button}`}
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
                renderCommentNode(child, commentMap)
              )}
            </div>
          )}
        </div>
      );
    };

    return commentTree.map((comment) => renderCommentNode(comment, commentMap));
  };

  return (
    <div className={styles.comments_container}>{renderComments(comments)}</div>
  );
}

export default Comment;
