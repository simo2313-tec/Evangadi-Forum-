const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");
const xss = require("xss");
const { v4: uuidv4 } = require("uuid");

async function register(req, res) {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide all required fields",
      });
    }

    // Validate email format - additional
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        // 400
        error: "Bad Request",
        message: "Invalid email format",
      });
    }

    // Validate password strength (e.g., min 8 chars)
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    // Sanitize all user input to prevent XSS
    const sanitizedUsername = xss(username);
    const sanitizedFirstName = xss(first_name);
    const sanitizedLastName = xss(last_name);
    const sanitizedEmail = xss(email);

    // Check for existing user
    const { rows: existing } = await dbConnection.query(
      "SELECT * FROM registration WHERE user_name = $1 OR user_email = $2",
      [sanitizedUsername, sanitizedEmail]
    );
    if (existing.length > 0) {
      return res
        .status(StatusCodes.CONFLICT) // 409
        .json({ error: "Conflict", message: "User already existed" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate UUID for the new user
    const userUuid = uuidv4();

    // Insert user into registration table
    const insertUserQuery =
      "INSERT INTO registration (user_name, user_email, password, user_uuid) VALUES ($1, $2, $3, $4) RETURNING user_id";
    const { rows: userRows } = await dbConnection.query(insertUserQuery, [
      sanitizedUsername,
      sanitizedEmail,
      hashedPassword,
      userUuid,
    ]);
    const userId = userRows[0].user_id;

    // Insert into profile table
    await dbConnection.query(
      "INSERT INTO profile (user_id, first_name, last_name) VALUES ($1, $2, $3)",
      [userId, sanitizedFirstName, sanitizedLastName]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        userid: userId,
        username: sanitizedUsername,
        user_uuid: userUuid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      userid: userId,
      username: sanitizedUsername,
      user_uuid: userUuid,
      email: sanitizedEmail,
      first_name: sanitizedFirstName,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { register };
