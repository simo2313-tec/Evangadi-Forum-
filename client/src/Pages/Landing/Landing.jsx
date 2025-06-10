import React from "react";
import Login from "../../Components/Login/Login";
import styles from "./landing.module.css";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";

function Landing() {
  return (
    <LayOut>
      <div className={styles.landingPageContainer}>
        <div className={styles.login}>
          <Login />
        </div>
        <div className={styles.about}>
          <About />
        </div>
      </div>
    </LayOut>
  );
}

export default Landing;
