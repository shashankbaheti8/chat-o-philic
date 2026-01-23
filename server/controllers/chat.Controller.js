const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.Model");
const User = require("../models/user.Model");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// Optimize fetchChats by using MongoDB Aggregation
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const results = await Chat.aggregate([
      // 1. Match chats where user is a participant
      {
        $match: {
          users: { $elemMatch: { $eq: req.user._id } },
        },
      },
      // 2. Populate users
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      // 3. Populate groupAdmin
      {
        $lookup: {
          from: "users",
          localField: "groupAdmin",
          foreignField: "_id",
          as: "groupAdmin",
        },
      },
      {
        $unwind: {
          path: "$groupAdmin",
          preserveNullAndEmptyArrays: true,
        },
      },
      // 4. Populate latestMessage
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessage",
        },
      },
      {
        $unwind: {
          path: "$latestMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      // 5. Populate sender in latestMessage
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "latestMessage.sender",
        },
      },
      {
        $unwind: {
          path: "$latestMessage.sender",
          preserveNullAndEmptyArrays: true,
        },
      },
      // 6. Project specific fields for users and groupAdmin
      {
        $project: {
          chatName: 1,
          isGroupChat: 1,
          users: { _id: 1, name: 1, email: 1, pic: 1 },
          groupAdmin: { _id: 1, name: 1, email: 1, pic: 1 },
          latestMessage: 1,
          createdAt: 1,
          updatedAt: 1,
          lastMessageSeenBy: 1,
        },
      },
      // 7. Sort by updatedAt descending
      { $sort: { updatedAt: -1 } },
    ]);

    // 8. Calculate unread counts efficiently
    // We still do this in parallel but optimize the logic
    const chatsWithUnreadCount = await Promise.all(
      results.map(async (chat) => {
        // Filter out empty 1-on-1 chats
        if (!chat.isGroupChat && !chat.latestMessage) {
          return null;
        }

        const chatObj = { ...chat };
        const Message = require("../models/message.Model");

        // Find last seen message efficiently
        const lastSeenEntry = chat.lastMessageSeenBy?.find(
          (entry) => entry.user.toString() === req.user._id.toString()
        );

        let unreadCount = 0;
        const countQuery = {
          chat: chat._id,
          sender: { $ne: req.user._id },
        };

        if (lastSeenEntry) {
          countQuery._id = { $gt: lastSeenEntry.message };
        }

        unreadCount = await Message.countDocuments(countQuery);
        chatObj.unreadCount = unreadCount;
        
        return chatObj;
      })
    );

    // Filter nulls (empty 1-on-1 chats)
    const finalResults = chatsWithUnreadCount.filter(chat => chat !== null);

    res.status(200).send(finalResults);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const updateGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      groupAdmin: userId,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  updateGroupAdmin,
};