const express = require("express");
const {
  allMessages,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/message.Controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/read/:chatId").put(protect, markMessagesAsRead);
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;
