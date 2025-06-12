// imports
const express = require("express");
const cors = require("cors");
const dbconnection = require("./db/db.Config");
const dotenv = require("dotenv");

//configuring detenv
dotenv.config();


// middlewares 
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Vite's default port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); // to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded request bodies

// import admin routes
const initDB_Router = require("./routes/initDB_route");
const createTableRouter = require("./routes/createTablesRoute");
// import user routes
const registerRouter = require("./routes/registerRoute");
const loginRouter = require("./routes/loginRoute");
const answerRoutes = require("./routes/postAnswerRoute");
const getquestions = require("./routes/getquestionsRoute");
const postQuestionRoutes = require("./routes/postQuestionsRoute");
const getSingleQuestion = require("./routes/getquestionsRoute");
const getAnswerRouter = require("./routes/getAnswerRoute");

// admin routes middleware
app.use("/api/admin", initDB_Router);
app.use("/api/admin", createTableRouter);
// user routes middleware
app.use("/api/users", registerRouter);
app.use("/api/users", loginRouter);
app.use("/api/users", answerRoutes);
app.use("/api/users", getquestions); //! check the exported file name syntax must be the same
app.use("/api/users", postQuestionRoutes);
app.use("/api/users", getSingleQuestion); //!
app.use("/api/users", getAnswerRouter);


// Start server and test database connection
async function startServer() {
  try {
    await dbconnection.execute("SELECT 'test'");
    app.listen(process.env.PORT);
    console.log(`Server is running on: http://localhost:${process.env.PORT}`);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

startServer();
