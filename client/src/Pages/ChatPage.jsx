import { Box, keyframes, Typography, IconButton, Stack, Avatar, Badge, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";
import ChatCard from "../Components/ChatCard";
import SingleChat from "../Components/SingleChat";

// Fade in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const { 
    user, 
    selectedChat, 
    setSelectedChat,
    chats,
    notification 
  } = ChatState();
  const { mode } = useThemeMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/");
      } else {
        setLoggedUser(userInfo);
      }
    } else {
      setLoggedUser(user);
    }
  }, [user, navigate]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: mode === "dark" 
          ? COLORS.backgroundDark 
          : "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Integrated Modern Header */}
      <Box
        sx={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 4,
          background: mode === "dark"
            ? `linear-gradient(135deg, ${COLORS.surfaceDark} 0%, #1a1a2e 100%)`
            : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          Chat-o-Philic
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#FFFFFF",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <SearchIcon />
          </IconButton>

          <IconButton
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "#FFFFFF",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <Badge badgeContent={notification.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Tooltip title={user?.name} arrow>
            <Avatar
              src={user?.pic}
              alt={user?.name}
              onClick={logoutHandler}
              sx={{
                width: 40,
                height: 40,
                cursor: "pointer",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.2s ease",
                "&:hover": {
                  border: "2px solid #FFFFFF",
                  transform: "scale(1.05)",
                },
              }}
            />
          </Tooltip>
        </Stack>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          p: 2,
          gap: 2,
        }}
      >
        {/* Left: Chat List Panel */}
        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            display: { xs: selectedChat ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            background: mode === "dark"
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            animation: `${fadeIn} 0.4s ease-out`,
          }}
        >
          {/* Chats Header */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
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
          </Box>

          {/* Chat Cards List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
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
            <Stack spacing={2}>
              {chats?.map((chat) => (
                <ChatCard
                  key={chat._id}
                  chat={chat}
                  selected={selectedChat?._id === chat._id}
                  onClick={() => setSelectedChat(chat)}
                  loggedUser={loggedUser}
                />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Right: Conversation Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: mode === "dark"
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
