const express = require("express");
const connectDB = require("./utils/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.Routes");
const chatRoutes = require("./routes/chat.Routes");
const messageRoutes = require("./routes/message.Routes");
const { notFound, errorHandler } = require("./middlewares/error.Middleware");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const allowedOrigins = [
  "http://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const paramsDir = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(paramsDir, "/frontend/build")));

  app.get(/(.*)/, (req, res) =>
    res.sendFile(path.resolve(paramsDir, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room, userName) => {
    socket.in(room).emit("typing", userName);
  });

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("message read", ({ chatId, userId, messageIds }) => {
    socket.in(chatId).emit("messages marked read", { userId, messageIds });
  });

  socket.on("group created", ({ group, members }) => {
    members.forEach((memberId) => {
      socket.in(memberId).emit("new group", group);
    });
  });

  socket.on("user added to group", ({ groupId, groupName, userId, addedBy }) => {
    socket.in(userId).emit("added to group notification", {
      groupId,
      groupName,
      addedBy,
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
