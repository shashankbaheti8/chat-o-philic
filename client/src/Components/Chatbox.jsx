import { Box, useMediaQuery, keyframes } from "@mui/material";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";

// Fade in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery("(max-width:768px)");

  if (isMobile && !selectedChat) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 0,
        background: mode === "dark"
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        width: { xs: "100%", md: "68%" },
        borderRadius: "12px",
        border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        boxShadow: mode === "dark"
          ? "0 8px 32px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.1)",
        height: "100%",
        overflow: "hidden",
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
