import React, { useState } from "react";

import styles from "../../../src/Components/Header/style.module.css"; //

import logo from "../../assets/imgs/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [mobile, setMobile] = useState(false);

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };

  return (
    <section className={styles.header_container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="ENGADI Logo" />
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
          <button className={styles.sign_in_btn}>SIGN IN</button>
          <div className={styles.menu_toggle} onClick={toggleMobile}>
            &#9776;
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
