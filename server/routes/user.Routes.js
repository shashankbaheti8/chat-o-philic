const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} = require("../controllers/user.Controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.route("/profile").put(protect, updateUserProfile);

module.exports = router;
