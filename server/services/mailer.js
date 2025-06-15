const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Set this in .env
    pass: process.env.EMAIL_PASSWORD, // Use app password
  },
});

async function sendAnswerNotification(email, questionId) {
  const mailOptions = {
    from: '"Evangadi Q&A Forum" <no-reply@qaapp.com>',
    to: email,
    subject: "Your question has been answered!",
    text: `Your question has been answered. Visit: https://http://localhost:4321/question-detail/${questionId}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendAnswerNotification };