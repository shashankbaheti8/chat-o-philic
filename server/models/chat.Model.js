const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes for better query performance
chatModel.index({ users: 1 }); // Index for finding chats by user
chatModel.index({ updatedAt: -1 }); // Index for sorting chats by recent activity

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
