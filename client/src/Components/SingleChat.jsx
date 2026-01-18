import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Stack,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import axios from "../axios";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";
import { useThemeMode } from "../Context/ThemeProvider";
import { COLORS } from "../constants";
import ComposeBar from "./ComposeBar";
import DateSeparator from "./DateSeparator";
import ScrollableFeed from "react-scrollable-feed";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  const isMobile = useMediaQuery("(max-width:768px)");
  const [messages, setMessages] = useState ([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { mode } = useThemeMode();

  const selectedChatRef = useRef();
  const emojiPickerRef = useRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async (e) => {
    if (e && e.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        setNewMessage("");
        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleSendClick = async () => {
    if (newMessage.trim()) {
      await sendMessage({ key: "Enter" });
    }
  };

  useEffect(() => {
    socket.connect();
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      const current = selectedChatRef.current;
      if (!current || current._id !== newMessageReceived.chat._id) {
        if (!notification.some((n) => n._id === newMessageReceived._id)) {
          setNotification((prev) => [newMessageReceived, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [notification, setNotification, setFetchAgain]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      if (timeNow - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {selectedChat ? (
        <>
          {/* Modern Chat Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2.5,
              background: mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {isMobile && (
              <IconButton
                onClick={() => setSelectedChat(null)}
                sx={{
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Avatar
              src={!selectedChat.isGroupChat ? getSenderFull(user, selectedChat.users)?.pic : null}
              alt={!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}
              sx={{ width: 48, height: 48 }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {!selectedChat.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat.chatName}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textSecondaryLight, fontSize: "0.8rem" }}>
                {isTyping ? "typing..." : "Active now"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CallIcon />
              </IconButton>
              <IconButton
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <VideocamIcon />
              </IconButton>
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <IconButton
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </ProfileModal>
              ) : (
                <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                  <IconButton
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </GroupChatModal>
              )}
            </Stack>
          </Box>

          {/* Messages Area with Date Groups */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: "auto",
              background: mode === "dark"
                ? "transparent"
                : "rgba(248, 250, 252, 0.5)",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress />
              </Box>
            ) : (
              <ScrollableFeed>
                {Object.keys(messageGroups).map((date) => (
                  <Box key={date}>
                    <DateSeparator date={date} />
                    {messageGroups[date].map((m, i) => {
                      const isOwnMessage = m.sender._id === user._id;
                      const showAvatar = !isOwnMessage && selectedChat.isGroupChat;

                      return (
                        <Box
                          key={m._id}
                          display="flex"
                          justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
                          mb={2}
                        >
                          {showAvatar && (
                            <Avatar
                              src={m.sender.pic}
                              alt={m.sender.name}
                              sx={{ width: 32, height: 32, mr: 1.5 }}
                            />
                          )}

                          <Box sx={{ maxWidth: "70%" }}>
                            {!isOwnMessage && selectedChat.isGroupChat && (
                              <Typography variant="caption" sx={{ color: COLORS.accent, fontWeight: 600, fontSize: "0.75rem", mb: 0.5, display: "block" }}>
                                {m.sender.name}
                              </Typography>
                            )}

                            <Box
                              sx={{
                                background: isOwnMessage
                                  ? mode === "dark"
                                    ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                                    : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`
                                  : mode === "dark"
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "#FFFFFF",
                                color: isOwnMessage ? "#FFFFFF" : mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
                                borderRadius: isOwnMessage ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                p: "12px 16px",
                                boxShadow: mode === "dark"
                                  ? "0 2px 8px rgba(0, 0,0, 0.3)"
                                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                marginLeft: !isOwnMessage && !showAvatar ? "40px" : 0,
                              }}
                            >
                              <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                {m.content}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ))}

                {isTyping && (
                  <Box sx={{ maxWidth: 60 }}>
                    <Lottie options={defaultOptions} height={30} width={50} />
                  </Box>
                )}
              </ScrollableFeed>
            )}
          </Box>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <Box
              ref={emojiPickerRef}
              sx={{
                position: "absolute",
                bottom: 90,
                left: 20,
                zIndex: 1000,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                borderRadius: 2,
              }}
            >
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setNewMessage((prev) => prev + emojiObject.emoji);
                }}
                theme={mode === "dark" ? "dark" : "light"}
                height={400}
                width={350}
                searchDisabled
                skinTonesDisabled
              />
            </Box>
          )}

          {/* Modern Compose Bar */}
          <ComposeBar
            message={newMessage}
            onChange={typingHandler}
            onSend={handleSendClick}
            onKeyDown={sendMessage}
            onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome to Chat-o-Philic
          </Typography>
          <Typography variant="body2">
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SingleChat;
