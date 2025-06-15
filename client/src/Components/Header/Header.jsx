import React, { useState, useContext } from "react";

import styles from "../../../src/Components/Header/header.module.css"; //

import logo from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { toast } from "react-toastify";

const Header = () => {
  const [mobile, setMobile] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };

  const logout = () => {
    // Clear both context and localStorage
    setUserData(null);
    // UserContext now handles localStorage clearing when setUserData(null) is called.
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");
    toast.success("Logged out successfully 👋"); // Use default toast style
    navigate("/landing");
  };

  return (
    <section className={styles.header_container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="EVANGADI Logo" />
        </div>
        <div className={styles.navbar}>
          <nav
            className={`${styles.nav} ${styles.mobileNav} ${
              mobile ? styles.show : ""
            }`}
          >
            <Link to="/home">Home</Link>
            <Link to="#">How it works</Link>

            {userData?.userid ? (
              <button onClick={logout} className={styles.sign_in_btn}>
                LOGOUT
              </button>
            ) : (
              <Link to="/landing">
                <button className={styles.sign_in_btn}>SIGN IN</button>
              </Link>
            )}
          </nav>

          <div className={styles.menu_toggle} onClick={toggleMobile}>
            {mobile ? "✕" : "☰"}
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
