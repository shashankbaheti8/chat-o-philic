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
  Info as InfoIcon,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
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
import ScrollableChat from "./ScrollableChat";

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
  const emojiTriggerRef = useRef();

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
    // eslint-disable-next-line
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
      // Check if click is outside picker AND outside the trigger button
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target) &&
        (!emojiTriggerRef.current || !emojiTriggerRef.current.contains(event.target))
      ) {
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
              <Typography variant="caption" sx={{ color: COLORS.textSecondaryLight, fontSize: "0.8rem", height: "1.2em", display: "block" }}>
                {isTyping ? "typing..." : ""}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
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
              <ScrollableChat messages={messages} />
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
            onEmojiClick={() => setShowEmojiPicker((prev) => !prev)}
            emojiTriggerRef={emojiTriggerRef}
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
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: mode === "dark" 
                ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                : `linear-gradient(135deg, ${COLORS.primary} 0%, #3B82F6 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
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
