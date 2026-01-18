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
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        width: { xs: "100%", md: 360 },
        height: "100%",
        background: mode === "dark"
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        p: 3,
        borderRadius: "12px",
        border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        boxShadow: mode === "dark"
          ? "0 8px 32px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.1)",
        animation: `${fadeIn} 0.4s ease-out`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: mode === "dark"
              ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
              : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Messages
        </Typography>
        <GroupChatModal>
          <Button
            startIcon={<AddIcon />}
            sx={{
              minWidth: "auto",
              px: 2,
              py: 1,
              fontWeight: 600,
              background: mode === "dark"
                ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
              color: "#fff",
              fontSize: "0.875rem",
              borderRadius: "8px",
              boxShadow: mode === "dark"
                ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                : "0 4px 12px rgba(15, 23, 42, 0.2)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: mode === "dark"
                  ? "0 6px 16px rgba(59, 130, 246, 0.4)"
                  : "0 6px 16px rgba(15, 23, 42, 0.3)",
              },
            }}
          >
            New
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
            borderRadius: "3px",
            "&:hover": {
              background: COLORS.accent,
            },
          },
        }}
      >
        {chats ? (
          <Stack spacing={1.5}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderRadius: "12px",
                  background: selectedChat === chat 
                    ? mode === "dark"
                      ? `linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(96, 165, 250, 0.1) 100%)`
                      : `linear-gradient(135deg, rgba(15, 23, 42, 0.1) 0%, rgba(30, 64, 175, 0.08) 100%)`
                    : "transparent",
                  border: `1px solid ${selectedChat === chat 
                    ? COLORS.accent 
                    : "transparent"}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: mode === "dark"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(15, 23, 42, 0.05)",
                    transform: "translateX(4px)",
                    boxShadow: mode === "dark"
                      ? "0 4px 12px rgba(59, 130, 246, 0.2)"
                      : "0 4px 12px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      border: selectedChat === chat 
                        ? `2px solid ${COLORS.accent}`
                        : `2px solid transparent`,
                      transition: "border-color 0.2s ease",
                    }}
                    alt={!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    src={!chat.isGroupChat ? chat.users.find(u => u._id !== loggedUser._id)?.pic : null}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: mode === "dark" 
                          ? COLORS.textPrimaryDark 
                          : COLORS.textPrimaryLight,
                        mb: 0.5,
                      }}
                    >
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Typography>
                    {chat.latestMessage && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === "dark"
                            ? COLORS.textSecondaryDark
                            : COLORS.textSecondaryLight,
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
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

export default MyChats;
