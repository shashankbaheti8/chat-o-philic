import {
  Paper,
  Stack,
  Avatar,
  Badge,
  Typography,
  Box,
} from "@mui/material";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

const ChatCard = ({ chat, selected, onClick, loggedUser }) => {
  const { mode } = useThemeMode();
  
  const getChatName = () => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find(u => u._id !== loggedUser?._id);
    return otherUser?.name || "Unknown";
  };

  const getChatAvatar = () => {
    if (chat.isGroupChat) return null;
    const otherUser = chat.users.find(u => u._id !== loggedUser?._id);
    return otherUser?.pic;
  };

  const getLastMessagePreview = () => {
    if (!chat.latestMessage) return "No messages yet";
    const content = chat.latestMessage.content;
    return content.length > 40 ? content.substring(0, 40) + "..." : content;
  };

  const getTimeStamp = () => {
    if (!chat.latestMessage) return "";
    const date = new Date(chat.latestMessage.createdAt);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  return (
    <Paper
      elevation={selected ? 8 : 2}
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: selected 
          ? `2px solid ${COLORS.accent}` 
          : `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        background: selected
          ? mode === "dark"
            ? `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.1) 100%)`
            : `linear-gradient(135deg, rgba(15, 23, 42, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)`
          : mode === "dark"
            ? "rgba(255, 255, 255, 0.03)"
            : "#FFFFFF",
        transform: selected ? "scale(1.02)" : "scale(1)",
        boxShadow: selected
          ? `0 8px 24px ${mode === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`
          : mode === "dark"
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          elevation: 6,
          transform: selected ? "scale(1.02)" : "translateY(-4px)",
          boxShadow: mode === "dark"
            ? "0 8px 16px rgba(0, 0, 0, 0.4)"
            : "0 8px 16px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Avatar with online status */}
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#10B981", // Online green
                border: `2px solid ${mode === "dark" ? "#141414" : "#FFFFFF"}`,
              }}
            />
          }
        >
          <Avatar
            src={getChatAvatar()}
            alt={getChatName()}
            sx={{ 
              width: 56, 
              height: 56,
              border: `2px solid ${selected ? COLORS.accent : "transparent"}`,
              transition: "border-color 0.3s ease",
            }}
          >
            {getChatName()[0]}
          </Avatar>
        </Badge>

        {/* Chat info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getChatName()}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
                fontSize: "0.7rem",
                flexShrink: 0,
                ml: 1,
              }}
            >
              {getTimeStamp()}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.875rem",
            }}
          >
            {chat.latestMessage?.sender.name && (
              <strong>{chat.latestMessage.sender.name}: </strong>
            )}
            {getLastMessagePreview()}
          </Typography>
        </Box>

        {/* Unread badge (placeholder for future) */}
        {/* <Badge badgeContent={3} color="error" /> */}
      </Stack>
    </Paper>
  );
};

export default ChatCard;
