const express = require("express");
const router = express.Router();
const db = require("../db/db.Config");
const crypto = require("crypto");
const { transporter } = require("../services/mailer");
const bcrypt = require("bcrypt");

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Check if user exists
    const [user] = await db.query(
      "SELECT user_id, user_email, user_name FROM registration WHERE user_email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "If this email is registered, you'll receive a reset link",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

    // Delete any existing tokens for this user
    await db.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [
      user[0].user_id,
    ]);

    // Store new token
    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user[0].user_id, resetToken, expiresAt]
    );

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello ${user[0].user_name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p style="margin: 25px 0;">
            <a href="${resetLink}" 
               style="background-color: #3498db; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p>Thank you,<br>The ${process.env.APP_NAME} Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "If this email is registered, you'll receive a reset link",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
});

// Verify reset token middleware
const verifyResetToken = async (req, res, next) => {
  const { token } = req.params;

  try {
    const [tokenData] = await db.query(
      `SELECT prt.*, r.user_email 
       FROM password_reset_tokens prt
       JOIN registration r ON prt.user_id = r.user_id
       WHERE prt.token = ? AND prt.expires_at > NOW()`,
      [token]
    );

    if (tokenData.length === 0) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    req.user = {
      id: tokenData[0].user_id,
      email: tokenData[0].user_email,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
    });
  }
};

// Verify token endpoint
router.get("/verify-reset-token/:token", verifyResetToken, (req, res) => {
  res.status(200).json({
    success: true,
    valid: true,
    email: req.user.email,
  });
});

// Reset password endpoint
router.post("/reset-password/:token", verifyResetToken, async (req, res) => {
  const { password } = req.body;
  const { id: userId } = req.user;

  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await db.query("UPDATE registration SET password = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    // Delete the used token
    await db.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [
      userId,
    ]);

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password",
    });
  }
});

module.exports = router;
