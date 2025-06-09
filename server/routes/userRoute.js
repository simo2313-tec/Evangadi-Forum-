const express = require("express");
const router = express.Router();
const { register } = require("../controller/userController");
const { login } = require("../controller/login");

router.post("/register", register);

//login route

router.post("/login", login);


module.exports = router;