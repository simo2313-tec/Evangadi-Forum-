// import React, { useContext } from "react";
// import styles from "./home.module.css";
// import { useState, useEffect } from "react";
// import axios from "../../Utility/axios";
// import { FaUserCircle } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { FaChevronRight } from "react-icons/fa";
// import LayOut from "../../Components/Layout/Layout"
// import { UserContext } from "../../Components/Context/userContext";

// function Home() {
//   const [userData, setUserData] = useContext(UserContext);
//   const [questions, setQuestions] = useState([]);
//   const navigate = useNavigate();

//   // handler for Ask Question button
//   const handleAskQuestion = () => {
//     if (!userData?.userid) {
//       // redirect with message
//       navigate("/landing", {
//         state: { message: "Please login to ask question" },
//       });
//     } else {
//       // user logged in, go to ask question page
//       navigate("/ask-questions");
//     }
//   };

//   useEffect(() => {
//     // Fetch questions from the API
//     axios
//       .get("/question")
//       .then((res) => {
//         setQuestions(res.data.question);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch questions:", err);
//         // If unauthorized (401), redirect to login
//         if (err.response?.status === 401) {
//           navigate("/landing");
//         }
//       });
//   }, [navigate]); // Added navigate to dependency array

//   return (
//     <LayOut>
//       <section className={styles.main_container}>
//         <div className={styles.homepage_container}>
//           <div className={styles.upper_section}>
//             <div className={styles.title}>
//               {/* Changed route from "/" to "/ask-questions" to fix navigation */}
//               <button onClick={handleAskQuestion} className={styles.Askbtn}>
//                 Ask Question
//               </button>
//               {/* Display actual username from user state, fallback to "User" if not available */}
//               <p>Welcome: {userData?.username || "User"}</p>
//             </div>
//             <h1 className={styles.questions_list}>Questions</h1>
//           </div>
//           {questions.length === 0 ? (
//             <p>No questions yet. Be the first to post a question!</p>
//           ) : (
//             questions.map((q) => (
//               // Added key prop to the Link component for proper React list rendering
//               <Link
//                 key={q.question_id}
//                 to={`/question-detail/${q.question_id}`}
//                 className={styles.link_container}
//               >
//                 <div>
//                   <div className={styles.user_container}>
//                     <div className={styles.user_question}>
//                       <div className={styles.usericon_and_username}>
//                         <div className={styles.inner_center}>
//                           <FaUserCircle size={80} className={styles.usericon} />
//                           <span>{q.user_name}</span>
//                         </div>
//                       </div>
//                       <p className={styles.Qtitle}>{q.question_title}</p>
//                     </div>
//                     <FaChevronRight size={20} className={styles.chevron} />
//                   </div>
//                 </div>
//               </Link>
//             ))
//           )}
//         </div>
//       </section>
//     </LayOut>
//   );
// }

// export default Home;






// import React, { useContext, useEffect, useState } from "react";
// import styles from "./home.module.css";
// import axios from "../../Utility/axios";
// import { FaUserCircle, FaChevronRight } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import LayOut from "../../Components/Layout/Layout";
// import { UserContext } from "../../Components/Context/userContext";
// import VoteButtons from "../../Components/VoteButtons/VoteButtons";

// function Home() {
//   const [userData] = useContext(UserContext);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleAskQuestion = () => {
//     if (!token) {
//       navigate("/landing", { state: { message: "Please login to ask a question" } });
//     } else {
//       navigate("/ask-questions");
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     // Your backend route for getting all questions is `/question` (singular)
//     axios
//       .get("/question")
//       .then((res) => {
//         // **THE FIX IS HERE**
//         // The API returns an object { questions: [...] } (plural), so we access that property.
//         if (res.data && Array.isArray(res.data.questions)) {
//           setQuestions(res.data.questions);
//         } else {
//           // This case will no longer be hit, but it's good for safety.
//           console.error("API response for questions is not in the expected format:", res.data);
//           setQuestions([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Failed to fetch questions:", err);
//         setError("Could not load questions. Please try again later.");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []); // Empty dependency array to run only once on mount

//   const handleVote = async (question_id, action) => {
//     if (!token) {
//       alert("Please log in to vote.");
//       return;
//     }
//     try {
//       // Your backend route for voting is `/questions/...` (plural)
//       const res = await axios.post(`/questions/${question_id}/${action}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const { likes, dislikes } = res.data;

//       setQuestions(prevQuestions =>
//         prevQuestions.map(q =>
//           q.question_id === question_id ? { ...q, likes, dislikes } : q
//         )
//       );
//     } catch (err) {
//       console.error("Failed to vote:", err);
//       if (err.response?.status === 401) {
//         alert("Your session may have expired. Please log in again.");
//         navigate("/landing");
//       } else {
//         alert("An error occurred while voting. Please try again.");
//       }
//     }
//   };

//   // Helper function to render the main content based on state
//   const renderContent = () => {
//     if (loading) {
//       return <p>Loading questions...</p>;
//     }
//     if (error) {
//       return <p>{error}</p>;
//     }
//     if (questions.length === 0) {
//       return <p>No questions yet. Be the first to post a question!</p>;
//     }
//     return questions.map((q) => (
//       q && q.question_id ? (
//         <div key={q.question_id} className={styles.question_item_wrapper}>
//           <Link
//             to={`/question-detail/${q.question_id}`}
//             className={styles.link_container}
//           >
//             <div className={styles.user_container}>
//               <div className={styles.user_question}>
//                 <div className={styles.usericon_and_username}>
//                   <div className={styles.inner_center}>
//                     <FaUserCircle size={80} className={styles.usericon} />
//                     <span>{q.user_name}</span>
//                   </div>
//                 </div>
//                 <p className={styles.Qtitle}>{q.question_title}</p>
//               </div>
//               <FaChevronRight size={20} className={styles.chevron} />
//             </div>
//           </Link>

//           <div className={styles.vote_section}>
//             <VoteButtons
//               likes={q.likes ?? 0}
//               dislikes={q.dislikes ?? 0}
//               onVote={(action) => handleVote(q.question_id, action)}
//             />
//           </div>
//         </div>
//       ) : null
//     ));
//   };

//   return (
//     <LayOut>
//       <section className={styles.main_container}>
//         <div className={styles.homepage_container}>
//           <div className={styles.upper_section}>
//             <div className={styles.title}>
//               <button onClick={handleAskQuestion} className={styles.Askbtn}>
//                 Ask Question
//               </button>
//               <p>Welcome: {userData?.username || "User"}</p>
//             </div>
//             <h1 className={styles.questions_list}>Questions</h1>
//           </div>
//           {renderContent()}
//         </div>
//       </section>
//     </LayOut>
//   );
// }

// export default Home;



import React, { useContext, useEffect, useState } from "react";
import styles from "./home.module.css";
import api from "../../Utility/axios";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LayOut from "../../Components/Layout/Layout";
import { UserContext } from "../../Components/Context/userContext";
import VoteButtons from "../../Components/VoteButtons/VoteButtons";
import { toast } from "react-toastify";

function Home() {
  const [userData] = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    const token = localStorage.getItem("token");
    if (!token || !userData?.userid) {
      navigate("/landing", {
        state: { message: "Please login to ask a question" },
      });
    } else {
      navigate("/ask-questions");
    }
  };

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/questions")
      .then((res) => {
        if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        } else {
          console.error("Unexpected data format:", res.data);
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        toast.error("Failed to load questions. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //  Vote handle
  const handleVote = async (question_id, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to vote.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const res = await api.post(`/api/questions/${question_id}/${action}`);
      const { likes, dislikes } = res.data;

      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === question_id ? { ...q, likes, dislikes } : q
        )
      );
    } catch (err) {
      console.error("Vote failed:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/landing");
      } else {
        toast.error("Could not cast vote. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <button onClick={handleAskQuestion} className={styles.Askbtn}>
                Ask Question
              </button>
              <p>Welcome: {userData?.username || "User"}</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {loading ? (
            <p>Loading questions...</p>
          ) : questions.length === 0 ? (
            <p>No questions yet. Be the first to post one!</p>
          ) : (
            questions.map((q) => (
              <div key={q.question_id} className={styles.question_item_wrapper}>
                <Link
                  to={`/question-detail/${q.question_id}`}
                  className={styles.link_container}
                >
                  <div className={styles.user_container}>
                    <div className={styles.user_question}>
                      <div className={styles.usericon_and_username}>
                        <div className={styles.inner_center}>
                          <FaUserCircle size={80} className={styles.usericon} />
                          <span>{q.user_name}</span>
                        </div>
                      </div>
                      <p className={styles.Qtitle}>{q.question_title}</p>
                    </div>
                    <FaChevronRight size={20} className={styles.chevron} />
                  </div>
                </Link>
                <div className={styles.vote_section}>
                  {/* Vote Buttons  */}
                  <VoteButtons
                    likes={q.likes ?? 0}
                    dislikes={q.dislikes ?? 0}
                    onVote={(action) => handleVote(q.question_id, action)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;