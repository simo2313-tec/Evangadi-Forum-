// src/Pages/ResetPassword.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Utility/axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/user/verify-reset-token/${token}`);
        if (response.data.valid) {
          setTokenValid(true);
          setEmail(response.data.email);
        } else {
          toast.error("Invalid or expired reset link");
          navigate("/forgot-password");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Invalid reset link");
        navigate("/forgot-password");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/user/reset-password/${token}`, {
        password,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className={styles.resetPasswordContainer}>
        <div className={styles.loadingContainer}>
          <ClipLoader color={"var(--primary)"} size={50} />
          <p>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <form onSubmit={handleSubmit} className={styles.resetPasswordForm}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.emailNote}>For: {email}</p>

        <div className={styles.formGroup}>
          <label htmlFor="password">New Password (min 8 characters)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength="8"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength="8"
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
              Updating...
            </span>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
