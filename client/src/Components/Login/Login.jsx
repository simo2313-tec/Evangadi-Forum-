import React, { useState } from "react";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../Utility/axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login", formData);
      
      // Store the token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify({
        userid: response.data.userid,
        username: response.data.username,
        email: response.data.email
      }));

      // Navigate to home page on successful login
      navigate("/home");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 404) {
        setError("User not found. Please register first.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login to your account</h2>
      <p className={styles.createAccountPrompt}>
        Don't have an account?{" "}
        <a
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLink}
        >
          Create a new account
        </a>
      </p>
      {error && <div className={styles.errorMessage}>{error}</div>}
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
            disabled={loading}
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
              disabled={loading}
            />
            <span
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
