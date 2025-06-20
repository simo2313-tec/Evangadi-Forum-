
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Utility/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.warn("Please enter your registered email address");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/user/forgot-password", { email });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>
          Enter your <strong>registered email address</strong> to receive a
          password reset link
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="email">Registered Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <ClipLoader color={"var(--white)"} loading={loading} size={20} />
              Processing...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </button>

        <div className={styles.backToLogin}>
          Remembered your password?{" "}
          <a onClick={() => navigate("/login")}>Login here</a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
