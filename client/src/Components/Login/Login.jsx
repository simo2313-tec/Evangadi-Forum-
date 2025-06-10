import React, { useState } from "react";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
    // Assuming successful login, navigate to home page
    navigate("/home"); // Navigate to the home page
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login to your account</h2>
      <p className={styles.createAccountPrompt}>
        Don't have an account? <a 
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLink}
        >
          Create a new account
        </a>
      </p>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
            />
            <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </span>
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          submit
        </button>
        <a 
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLinkBottom}
        >
          Create an account?
        </a>
      </form>
    </div>
  );
}

export default Login; 
