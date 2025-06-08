// import React from "react";
// import styles from "./home.module.css";

// function Home() {
//   return (
//     <>
//       <h1 className={styles.title}>Home Page</h1>
//     </>
//   );
// }

// export default Home;

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
const Home = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5400/api/question")
      .then(({ data }) => setQuestions(data))
      .catch((err) => console.error("Failed to fetch questions:", err));
  }, []);
  return (
    <div>
      <Header />
      <h1>Evangadi Forum</h1>
      {questions.map((q) => (
        <div key={q.question_id}>
          <h3>{q.question_title}</h3>
          <p>{q.question_description}</p>
          <p>By: {q.user_name} | Tag: {q.tag}</p>
        </div>
      ))}
      <Footer />
    </div>
  );
};
export default Home;
