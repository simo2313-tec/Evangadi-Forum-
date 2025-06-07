const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");

async function register(req, res) {
  try {
    const { username, firstname, lastname, email, password } = req.body;
    if (!username || !firstname || !lastname || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }


    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid email format" });
    }


    // Validate password strength (e.g., min 8 chars)
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters" });
    }

    
    // Check for existing user
    const [existing] = await dbConnection.query(
      "SELECT * FROM registration WHERE user_name = ? OR user_email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert user into registration table
    const [result] = await dbConnection.query(
      "INSERT INTO registration (user_name, user_email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );


    // Insert into profile table
    await dbConnection.query(
      "INSERT INTO profile (user_id, first_name, last_name) VALUES (?, ?, ?)",
      [result.insertId, firstname, lastname]
    );

    // Generate JWT
    const token = jwt.sign(
      { userid: result.insertId, username },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res
      .status(StatusCodes.CREATED)
      .json({
        userid: result.insertId,
        username,
        firstname,
        lastname,
        email,
        token,
      });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error registering user", error: error.message });
  }
}


//login route implementation FOR already registered users
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id, user_email, password FROM registration WHERE user_email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found, please register first" });
    }

    const rows = user[0];

    const isPasswordValid = await bcrypt.compare(password, rows.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }

    const userid = rows.user_id;
    const username = rows.user_name;

    const token = jwt.sign(
      { userid, username },
      "your_jwt_secret",
      { expiresIn: "30d" }
    );

    res.status(StatusCodes.OK).json({
      userid: rows.user_id,
      username: rows.user_name,
      email: rows.user_email,
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error logging in", error: error.message });
  }
}



module.exports = { register, login };