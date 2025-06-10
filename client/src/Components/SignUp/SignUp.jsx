import React, { useState } from "react";
import styles from "./signup.module.css";
import api from "../../Utility/axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e.target);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.userName) newErrors.userName = "User name is required.";
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const response = await api.post("/users/register", {
        username: formData.userName,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful!");
      navigate("/login");
      // TODO: Store token in local storage or context
      // TODO: Clear form data
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
      });
      // console.log(response.data);
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Registration failed.",
      });
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Join the network</h2>

        <p className={styles.subtitle}>
          Already have an account?{" "}
          <a onClick={() => navigate("/login")} className={styles.signInLink}>
            Sign in
          </a>
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={
            styles.input + (errors.email ? " " + styles.inputError : "")
          }
          required
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}
        <div className={styles.nameRow}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={
              styles.input + (errors.firstName ? " " + styles.inputError : "")
            }
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={
              styles.input + (errors.lastName ? " " + styles.inputError : "")
            }
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {(errors.firstName || errors.lastName) && (
          <div className={styles.errorMessage}>
            {errors.firstName || errors.lastName}
          </div>
        )}
        <input
          type="text"
          name="userName"
          placeholder="User Name"
          className={
            styles.input + (errors.userName ? " " + styles.inputError : "")
          }
          required
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && (
          <div className={styles.errorMessage}>{errors.userName}</div>
        )}
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={
              styles.input + (errors.password ? " " + styles.inputError : "")
            }
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#6c757d"
                  strokeWidth="2"
                  d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#6c757d"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#6c757d"
                  strokeWidth="2"
                  d="M17.94 17.94C16.11 19.25 14.13 20 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.53 9.53A3.001 3.001 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29"
                />
                <path stroke="#6c757d" strokeWidth="2" d="m1 1 22 22" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <div className={styles.errorMessage}>{errors.password}</div>
        )}
        <button type="submit" className={styles.submitBtn}>
          Agree and Join
        </button>

        {errors.api && (
          <div
            className={styles.errorMessage}
            style={{ textAlign: "center", marginBottom: "1em" }}
          >
            {errors.api}
          </div>
        )}

        <p className={styles.agreeText}>
          I agree to the{" "}
          <a href="#" className={styles.link}>
            privacy policy
          </a>{" "}
          and{" "}
          <a href="#" className={styles.link}>
            terms of service
          </a>
          .
        </p>
        <p className={styles.alreadyAccount}>
          <a
            onClick={() => navigate("/login")}
            className={styles.link}
          >
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
