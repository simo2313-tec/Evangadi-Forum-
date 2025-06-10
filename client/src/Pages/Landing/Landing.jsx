import React from "react";
import Login from "../../Components/Login/Login";
import styles from "./landing.module.css";

function Landing() {
  return (
    <div className={styles.landingPageContainer}>
      <Login />
    </div>
  );
}

export default Landing;
