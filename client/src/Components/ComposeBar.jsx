import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
} from "@mui/icons-material";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

const ComposeBar = ({ 
  message, 
  onChange, 
  onSend, 
  onKeyDown,
  onEmojiClick,
  disabled,
  emojiTriggerRef
}) => {
  const { mode } = useThemeMode();

  return (
    <Box
      sx={{
        p: 3,
        background: mode === "dark"
          ? "rgba(255, 255, 255, 0.02)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: "28px", // Pill shape
          p: 0.5,
          pl: 2,
          display: "flex",
          alignItems: "center",
          background: mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "#FFFFFF",
          border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          transition: "all 0.3s ease",
          "&:focus-within": {
            boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.15)`,
            borderColor: COLORS.accent,
          },
        }}
      >
        {/* Emoji Button */}
        <Tooltip title="Emoji">
          <IconButton
            ref={emojiTriggerRef}
            size="small"
            onClick={onEmojiClick}
            sx={{
              color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                transform: "scale(1.1)",
              },
            }}
          >
            <EmojiIcon />
          </IconButton>
        </Tooltip>


        {/* Input */}
        <InputBase
          fullWidth
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          sx={{
            px: 2,
            fontSize: "0.95rem",
            color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
            "& ::placeholder": {
              color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
              opacity: 0.6,
            },
          }}
        />

        {/* Send Button */}
        <Tooltip title="Send Message">
          <span>
            <IconButton
              onClick={onSend}
              disabled={!message.trim() || disabled}
              sx={{
                background: !message.trim()
                  ? "transparent"
                  : mode === "dark"
                    ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                    : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
                color: "#fff",
                width: 36,
                height: 36,
                mr: 0.5,
                borderRadius: "50%",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: !message.trim() ? "none" : "scale(1.1)",
                  boxShadow: !message.trim()
                    ? "none"
                    : mode === "dark"
                      ? `0 6px 16px rgba(59, 130, 246, 0.4)`
                      : `0 6px 16px rgba(15, 23, 42, 0.3)`,
                },
                "&:active": {
                  transform: !message.trim() ? "none" : "scale(0.95)",
                },
                "&:disabled": {
                  background: "transparent",
                  color: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>
    </Box>
  );
};

export default ComposeBar;
