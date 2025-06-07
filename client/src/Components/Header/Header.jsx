import React, { useState } from "react";
import "./style.css";
import logo from "../../assets/imgs/logo.png";

const Header = () => {
  const [mobile, setMobile] = useState(false);

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="ENGADI Logo" />
      </div>

      <nav className={`nav mobile-nav ${mobile ? "show" : ""}`}>
        <a href="#">Home</a>
        <a href="#">How it works</a>
      </nav>

      <button className="sign-in-btn">SIGN IN</button>

      <div className="menu-toggle" onClick={toggleMobile}>
        &#9776;
      </div>
    </header>
  );
};

export default Header;
