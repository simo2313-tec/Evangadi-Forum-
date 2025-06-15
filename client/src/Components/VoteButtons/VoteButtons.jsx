// Components/VoteButtons/VoteButtons.jsx
import React from "react";
import styles from "./voteButtons.module.css"; // optional styling

function VoteButtons({ likes = 0, dislikes = 0, onVote }) {
  return (
    <div className={styles.vote_buttons}>
      <button onClick={() => onVote("like")} aria-label="Like this question">
        👍 {likes}
      </button>
      <button onClick={() => onVote("dislike")} aria-label="Dislike this question">
        👎 {dislikes}
      </button>
    </div>
  );
}

export default VoteButtons;


