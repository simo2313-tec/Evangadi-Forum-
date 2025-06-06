import React, { useState } from "react";
import styles from "./singup.module.css";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm}>
        <h2 className={styles.title}>Join the network</h2>
        <p className={styles.subtitle}>
          Already have an account?{" "}
          <a href="#" className={styles.signInLink}>
            Sign in
          </a>
        </p>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          required
        />
        <div className={styles.nameRow}>
          <input
            type="text"
            placeholder="First Name"
            className={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className={styles.input}
            required
          />
        </div>
        <input
          type="text"
          placeholder="User Name"
          className={styles.input}
          required
        />
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            required
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
        <button type="submit" className={styles.submitBtn}>
          Agree and Join
        </button>
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
          <a href="#" className={styles.link}>
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
