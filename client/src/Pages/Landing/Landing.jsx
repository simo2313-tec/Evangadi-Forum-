import React from "react";
import { useLocation } from "react-router-dom";
import Login from "../../Components/Login/Login";
import SignUp from "../../Components/Signup/Signup";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";
import styles from "./landing.module.css";

function Landing() {
  const location = useLocation();
  const isSignupPage = location.pathname === "/sign-up";



  return (
    <LayOut>
      <div className={styles.landingPageContainer}>
        <div className={styles.login}>
          <div
            className={styles.sliderWrapper}
            style={{
              transform: isSignupPage ? "translateX(-50%)" : "translateX(0)",
            }}
          >
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <Login />
            </div>
            <div className={`${styles.formPane} ${styles.shrink}`}>
              <SignUp />
            </div>
          </div>
        </div>
        <div className={`${styles.about} ${styles.shrinkAbout}`}>
          <About />
        </div>
      </div>
    </LayOut>
  );
}

export default Landing;
