const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controller/profileController");

router.get("/:user_uuid", getProfile);
router.put("/:user_uuid", updateProfile);
router.delete("/:user_uuid", deleteProfile);

module.exports = router;
