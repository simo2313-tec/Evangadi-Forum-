import React, { useState } from "react";

import styles from "../../../src/Components/Header/style.module.css"; //

import logo from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";

const Header = () => {
  const [mobile, setMobile] = useState(false);
  const [userData, setUserData] = useContext(UserContext);
  const navigate = useNavigate()

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };

  const logout = () => {
    setUserData(null);
    localStorage.setItem("token", "");
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
          </nav>


          
          {userData ? (
        <button onClick={logout} className={styles.sign_in_btn}>
          LOGOUT
        </button>
      ) : (
        <Link to="/landing">
          <button className={styles.sign_in_btn}>SIGN IN</button>
        </Link>
      )}


          
          <div className={styles.menu_toggle} onClick={toggleMobile}>
            &#9776;
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;




