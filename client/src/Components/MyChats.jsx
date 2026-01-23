import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  keyframes,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import axios from "../axios";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import { getSender } from "../Config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

// Fade in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { mode } = useThemeMode();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]); // removed chats dependency if it exists, or ensure fetchChats isn't triggered by selection

  const styles = getStyles(mode);

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h6" sx={styles.headerTitle}>
          Messages
        </Typography>
        <GroupChatModal>
          <Button startIcon={<AddIcon />} sx={styles.newButton}>
            New
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box sx={styles.chatList}>
        {chats && Array.isArray(chats) ? (
          <Stack spacing={1.5}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={styles.chatItem(selectedChat === chat)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={styles.avatar(selectedChat === chat)}
                    alt={!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    src={!chat.isGroupChat ? chat.users.find(u => u._id !== loggedUser._id)?.pic : null}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={styles.chatName}>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Typography>
                    {chat.latestMessage && (
                      <Typography variant="caption" sx={styles.latestMessage}>
                        <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

const getStyles = (mode) => {
  const isDark = mode === "dark";
  
  return {
    container: {
      display: { xs: "flex", md: "flex" }, // Adjusted based on logic, assuming visibility handled by parent or logic preserved
      flexDirection: "column",
      width: { xs: "100%", md: 360 },
      height: "100%",
      background: isDark
        ? "rgba(255, 255, 255, 0.03)"
        : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      p: 3,
      borderRadius: "12px",
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
      boxShadow: isDark
        ? "0 8px 32px rgba(0, 0, 0, 0.3)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
      animation: `${fadeIn} 0.4s ease-out`,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3,
    },
    headerTitle: {
      fontWeight: 700,
      background: isDark
        ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
        : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    newButton: {
      minWidth: "auto",
      px: 2,
      py: 1,
      fontWeight: 600,
      background: isDark
        ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
        : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
      color: "#fff",
      fontSize: "0.875rem",
      borderRadius: "8px",
      boxShadow: isDark
        ? "0 4px 12px rgba(59, 130, 246, 0.3)"
        : "0 4px 12px rgba(15, 23, 42, 0.2)",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: isDark
          ? "0 6px 16px rgba(59, 130, 246, 0.4)"
          : "0 6px 16px rgba(15, 23, 42, 0.3)",
      },
    },
    chatList: {
      flex: 1,
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: isDark
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
        borderRadius: "3px",
        "&:hover": {
          background: COLORS.accent,
        },
      },
    },
    chatItem: (isSelected) => ({
      cursor: "pointer",
      p: 2,
      borderRadius: "12px",
      background: isSelected
        ? isDark
          ? `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(96, 165, 250, 0.1) 100%)`
          : `linear-gradient(135deg, rgba(15, 23, 42, 0.1) 0%, rgba(30, 64, 175, 0.08) 100%)`
        : "transparent",
      border: `1px solid ${isSelected
        ? COLORS.accent
        : "transparent"}`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: isDark
          ? "rgba(59, 130, 246, 0.15)"
          : "rgba(15, 23, 42, 0.05)",
        transform: "translateX(4px)",
        boxShadow: isDark
          ? "0 4px 12px rgba(59, 130, 246, 0.2)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
      },
    }),
    avatar: (isSelected) => ({
      width: 48,
      height: 48,
      border: isSelected
        ? `2px solid ${COLORS.accent}`
        : `2px solid transparent`,
      transition: "border-color 0.2s ease",
    }),
    chatName: {
      fontWeight: 600,
      color: isDark 
        ? COLORS.textPrimaryDark 
        : COLORS.textPrimaryLight,
      mb: 0.5,
    },
    latestMessage: {
      color: isDark
        ? COLORS.textSecondaryDark
        : COLORS.textSecondaryLight,
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }
  };
};

export default MyChats;
