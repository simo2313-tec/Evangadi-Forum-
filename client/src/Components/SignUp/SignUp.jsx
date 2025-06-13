import React, { useState } from "react";
import styles from "./signup.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../Utility/axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";

function SignUp() {
  const [userData, setUserData] = useContext(UserContext);
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
      const response = await api.post("/user/register", {
        username: formData.userName,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful!");
      navigate("/home");
      // TODO: Store token in local storage or context
      // On successful sign up
      console.log(response)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userid: response.data.userid,
          username: response.data.username,
          email: response.data.email,
        })
      );

      setUserData({
        userid: response.data.userid,
        username: response.data.username,
        email: response.data.email,
      });
      
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

          <span
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
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
          <a onClick={() => navigate("/login")} className={styles.link}>
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
