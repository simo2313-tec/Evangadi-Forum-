const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test transporter connection
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// Password reset email function
async function sendPasswordResetEmail(email, username, resetLink) {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello ${username},</p>
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
    });
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}

module.exports = {
  transporter,
  sendPasswordResetEmail,
};
