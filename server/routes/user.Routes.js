const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/user.Controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;
