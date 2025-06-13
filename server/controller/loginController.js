const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/db.Config");


//login route implementation FOR already registered users
async function login(req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          error: "Bad Request",
          message: "Please provide all required fields",
        });
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
  
      const token = jwt.sign({ userid, username }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
  
      res.status(StatusCodes.OK).json({
        message: "User login successful",
        userid: rows.user_id,
        username: rows.user_name,
        email: rows.user_email,
        token,
      });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "Internal Server Error",
          message: "An unexpected error occurred.",
        });
    }
  }
module.exports = { login };  