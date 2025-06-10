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
    // return res.json({username: username})
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);


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
      process.env.JWT_SECRET,
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





module.exports = { register };