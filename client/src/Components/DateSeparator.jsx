import { Box, Chip, Divider } from "@mui/material";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

const DateSeparator = ({ date }) => {
  const { mode } = useThemeMode();
  
  const getDateLabel = () => {
    const today = new Date();
    const messageDate = new Date(date);
    
    const isToday = today.toDateString() === messageDate.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === messageDate.toDateString();
    
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        my: 3,
      }}
    >
      <Divider 
        sx={{ 
          flex: 1,
          borderColor: mode === "dark" 
            ? "rgba(255,255,255,0.1)" 
            : "rgba(0,0,0,0.1)",
        }} 
      />
      <Chip
        label={getDateLabel()}
        size="small"
        sx={{
          mx: 2,
          fontWeight: 600,
          fontSize: "0.75rem",
          background: mode === "dark"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.05)",
          color: mode === "dark" 
            ? COLORS.textSecondaryDark 
            : COLORS.textSecondaryLight,
          border: "none",
        }}
      />
      <Divider 
        sx={{ 
          flex: 1,
          borderColor: mode === "dark" 
            ? "rgba(255,255,255,0.1)" 
            : "rgba(0,0,0,0.1)",
        }} 
      />
    </Box>
  );
};

export default DateSeparator;
