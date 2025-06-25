import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "./Question.module.css";
import getTimeDifference from "../../Utility/helpers";
import VoteButtons from "../VoteButtons/VoteButtons";

function Question({
  questionDetail,
  handleDeleteQuestion,
  setEditQuestionMode,
  scrollToAnswerForm,
  handleVote,
}) {
  const { userData } = useContext(UserContext);
  return (
    <div className={styles.question_container}>
      <div className={styles.main_content}>
        <div className={styles.question_header}>
          <h2>{questionDetail.question_title}</h2>
          <div className={styles.question_meta_container}>
            <div className={styles.question_meta}>
              <span>
                Asked by:{" "}
                <Link
                  to={`/profile/${questionDetail.user_uuid}`}
                  className={styles.author_link}
                >
                  @{questionDetail.user_name}
                </Link>
                {userData?.userid === questionDetail.user_id && " (You)"}
              </span>
              <span>{getTimeDifference(questionDetail.created_at)}</span>
            </div>
            <div className={styles.vote_container}>
              <VoteButtons
                likes={questionDetail.likes}
                dislikes={questionDetail.dislikes}
                userVote={questionDetail.user_vote_type}
                onVote={(action) =>
                  handleVote("question", questionDetail.question_id, action)
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.question_body}>
          <p>{questionDetail.question_description}</p>
          {questionDetail.tag && (
            <span className={styles.tag}>{questionDetail.tag}</span>
          )}
        </div>

        <div className={styles.question_actions_group}>
          {userData?.userid === questionDetail.user_id && (
            <div className={styles.question_actions}>
              <button
                onClick={() => setEditQuestionMode(true)}
                className={styles.edit_btn}
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={handleDeleteQuestion}
                className={styles.delete_btn}
              >
                <MdDelete /> Delete
              </button>
            </div>
          )}
          <button
            onClick={scrollToAnswerForm}
            className={styles.answer_question_btn}
          >
            Answer this Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
