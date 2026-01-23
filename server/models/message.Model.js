const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Indexes for better query performance
messageSchema.index({ chat: 1, createdAt: -1 }); // Compound index for fetching messages by chat
messageSchema.index({ content: "text" }); // Text index for search functionality

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
