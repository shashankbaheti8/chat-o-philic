const asyncHandler = require("express-async-handler");
const Message = require("../models/message.Model");
const User = require("../models/user.Model");
const Chat = require("../models/chat.Model");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await Message.countDocuments({ chat: req.params.chatId });

    // Fetch messages with pagination, sorted by newest first
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: -1 }) // Newest first for pagination
      .limit(limit)
      .skip(skip)
      .populate("sender", "name pic email")
      .populate("chat");

    // Return in chronological order (oldest first for display)
    res.json({
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const fullMessage = await Message.findById(newMessage._id)
      .populate("sender", "name pic")
      .populate("chat")
      .populate({
        path: "chat.users",
        select: "name pic email",
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });

    res.json(fullMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
