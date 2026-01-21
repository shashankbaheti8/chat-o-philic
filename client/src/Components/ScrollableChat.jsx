import { Avatar, Tooltip, Box, Typography, keyframes } from "@mui/material";
import { useRef, useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
} from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { getMessageTimestamp } from "../utils/dateUtils";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

// Fade in animation for messages
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();
  const { mode } = useThemeMode();
  const messagesEndRef = useRef(null);

  const isGroupChat = selectedChat?.isGroupChat;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle paginated response structure if passed directly
  const messagesList = Array.isArray(messages) 
    ? messages 
    : (messages?.messages && Array.isArray(messages.messages)) 
      ? messages.messages 
      : [];

  return (
    <Box sx={{ overflowY: "auto", height: "100%", p: 1 }}>
      {messagesList &&
        messagesList.map((m, i) => {
          const isOwnMessage = m.sender._id === user._id;
          const showAvatar = !isOwnMessage && isGroupChat && 
            (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id));
          
          return (
            <Box
              key={m._id}
              display="flex"
              justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
              mb={2}
              sx={{
                animation: `${fadeInUp} 0.3s ease-out`,
              }}
            >
              {/* Avatar for group chats */}
              {showAvatar && (
                <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 1.5,
                      border: `2px solid ${COLORS.accent}`,
                      boxShadow: `0 2px 8px rgba(59, 130, 246, 0.2)`,
                    }}
                    alt={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}

              {/* Message bubble */}
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  maxWidth: "70%", 
                  alignItems: isOwnMessage ? "flex-end" : "flex-start" 
                }}
              >
                {/* Sender name for group chats */}
                {!isOwnMessage && isGroupChat && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: COLORS.accent,
                      mb: 0.5,
                      ml: showAvatar ? 0 : "44px",
                    }}
                  >
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
                        : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: !isOwnMessage ? "blur(10px)" : "none",
                    border: `1px solid ${isOwnMessage 
                      ? "transparent" 
                      : mode === "dark" 
                        ? "rgba(255, 255, 255, 0.1)" 
                        : "rgba(0, 0, 0, 0.05)"
                    }`,
                    color: isOwnMessage 
                      ? "#FFFFFF" 
                      : mode === "dark" 
                        ? COLORS.textPrimaryDark 
                        : COLORS.textPrimaryLight,
                    marginLeft: !isOwnMessage && !showAvatar ? "44px" : 0,
                    borderRadius: isOwnMessage ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "12px 16px",
                    boxShadow: isOwnMessage 
                      ? mode === "dark"
                        ? `0 4px 12px rgba(59, 130, 246, 0.3)`
                        : `0 4px 12px rgba(15, 23, 42, 0.2)`
                      : mode === "dark"
                        ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: isOwnMessage
                        ? mode === "dark"
                          ? `0 6px 16px rgba(59, 130, 246, 0.4)`
                          : `0 6px 16px rgba(15, 23, 42, 0.3)`
                        : mode === "dark"
                          ? "0 4px 12px rgba(0, 0, 0, 0.4)"
                          : "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.95rem",
                      wordBreak: "break-word",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
                  </Typography>
                </Box>

                {/* Timestamp */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
                    mt: 0.5,
                    ml: !isOwnMessage && !showAvatar ? "44px" : 0.5,
                    opacity: 0.7,
                  }}
                >
                  {getMessageTimestamp(m.createdAt)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ScrollableChat;
