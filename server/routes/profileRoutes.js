const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controller/profileController");

router.get("/:user_uuid", getProfile);
router.put("/:user_uuid", authMiddleware, updateProfile);
router.delete("/:user_uuid", authMiddleware, deleteProfile);

module.exports = router;
