# Evangadi Forum 2.0: A Modern Full-Stack Q&A Experience

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://evangadi-forum-beta7.vercel.app/)

Welcome to **Evangadi Forum 2.0**! 🚀

A modern, community-driven Q&A platform built for the next generation of learners and experts. Featuring a beautiful UI, real-time interactions, robust security, and seamless user experience—Evangadi Forum is your go-to place to ask, answer, and connect.

---

## 🛠️ Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=react,vite,html,css,js,nodejs,express,mysql,postgres,cypress,vscode,git,github,npm,vercel,render&perline=8)](https://skillicons.dev)

- **Frontend**: React, Vite, HTML5, CSS3 (CSS Modules), JavaScript (ES6+), React Router, Axios
- **Backend**: Node.js, Express.js, MySQL, PostgreSQL(For Render DB)
- **Testing**: Cypress (E2E)
- **Dev Tools & Deployment**: VS Code, Git, GitHub, npm, Vercel, Render

---

## 🌟 Key Features & Recent Updates

- **UUID-Based Addressing**: All user profiles and questions use secure, non-sequential UUIDs for privacy and security.
- **Public Profiles with Private Controls**: Profiles are publicly viewable, but only the owner can edit or delete.
- **Modern Authentication**: JWT-based login/signup, with secure password hashing and XSS protection.
- **Dynamic Q&A System**: Post, edit, and answer questions with instant feedback and pre-filled edit forms.
- **Nested Comments & Voting**: Engage in deep discussions and upvote/downvote questions and answers.
- **Responsive, Glassmorphic UI**: Mobile-first, beautiful design with smooth animations and a friendly chatbot.
- **Comprehensive E2E Testing**: Cypress tests for all major user flows, including signup, login, and navigation.
- **Performance & Security**: Indexed DB queries, input sanitization, strict authorization, and rate limiting.
- **Easy Deployment**: Ready for Vercel and Render with optimized build scripts.

---

## 🔒 Security and Performance Enhancements

- **UUIDs for All Public Entities**: Prevents enumeration and scraping.
- **Strict Auth Middleware**: Only owners can edit/delete their content.
- **Input Sanitization**: All user input is sanitized with `xss` on the backend.
- **Optimized Queries**: Fast, indexed DB access for all major endpoints.
- **Rate Limiting**: Protection against brute-force and denial-of-service attacks.

---

## ✅ Testing Strategy

- **Cypress**: End-to-end tests for signup, login, question posting, and navigation. Ensures real user flows work perfectly.

---

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Tesfamichael12/Evangadi-Forum.git
    cd Evangadi-Forum
    ```
2.  **Setup Backend**:
    ```bash
    cd server
    npm install
    # Set up your .env file with database credentials
    npm start
    ```
3.  **Setup Frontend**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
4.  **Run Cypress Tests**:
    ```bash
    npm run cypress:open
    ```

---

## 📂 Project Structure

```
Evangadi-Forum/
├── client/           # React frontend
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Utility/
│   │   └── assets/
│   ├── public/
│   └── ...
├── server/           # Node.js backend
│   ├── controller/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   └── ...
└── ...
```

---

## 📝 Credits & Links

- Original repo: [mihret7/Evangadi-Forum](https://github.com/mihret7/Evangadi-Forum)
- UI/UX inspiration: [Evangadi Networks](https://www.evangadi.com/)
- Icons: [React Icons](https://react-icons.github.io/react-icons/)
- Spinner: [react-spinners](https://www.npmjs.com/package/react-spinners)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

> Made with ❤️ by the Evangadi Forum team.

---

## 👥 Contributors

| FName        | LName        |
| ------------ | ------------ |
| Eden         | Teklezghi    |
| Abdulhakim   | Sefa         |
| EKRAM        | ABDU         |
| Eyale        | Kerie        |
| Fozia        | Hussein      |
| Ketemaw      | Asmare       |
| Mihret       | Bizuayehu    |
| Seid         | Mohammed     |
| SIMON        | GHEBREMEDHIN |
| Tesfamichael | Tafere       |
| Tewodros     | Gebretsadkan |
| Yilak        | Muluneh      |
