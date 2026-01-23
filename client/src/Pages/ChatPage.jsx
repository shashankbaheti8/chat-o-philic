import { 
  Box, 
  keyframes, 
  Typography, 
  IconButton, 
  Stack, 
  Avatar, 
  Badge, 
  Tooltip,
  Drawer,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
  Button
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { COLORS } from "../constants";
import { useThemeMode } from "../Context/ThemeProvider";
import ChatCard from "../Components/ChatCard";
import SingleChat from "../Components/SingleChat";
import axios from "../axios";
import { toast } from "react-toastify";
import ChatLoading from "../Components/ChatLoading";
import UserListItem from "../Components/userAvatar/UserListItem";
import ProfileModal from "../Components/Miscellaneous/ProfileModal";
import SearchDrawer from "../Components/Miscellaneous/SearchDrawer";
import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "../Components/Miscellaneous/GroupChatModal";
import AddIcon from "@mui/icons-material/Add";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const { 
    user, 
    selectedChat, 
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();
  
  const { mode } = useThemeMode();
  const navigate = useNavigate();

  // Initial Auth Check and Setup
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  // Fetch Chats
  const fetchChats = useCallback(async () => {
    if (!user) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to load chats");
    }
  }, [user, setChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats, fetchAgain]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Debounced Search


  // Removed manual handleSearch function as it is replaced by the effect



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
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: mode === "dark"
            ? "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }
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
          <Tooltip title="Search Users">
            <IconButton
              onClick={() => setDrawerOpen(true)}
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
          </Tooltip>



          <Tooltip title={user?.name} arrow>
            <Avatar
              src={user?.pic}
              alt={user?.name}
              onClick={(e) => setAnchorEl(e.currentTarget)}
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
          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
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
                size="small"
                sx={{
                  background: mode === "dark" 
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    background: mode === "dark" 
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }
                }}
              >
                New Group
              </Button>
            </GroupChatModal>
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
            {chats ? (
              <Stack spacing={2}>
                {chats.map((chat) => (
                  <ChatCard
                    key={chat._id}
                    chat={chat}
                    selected={selectedChat?._id === chat._id}
                    onClick={() => setSelectedChat(chat)}
                    loggedUser={loggedUser}
                  />
                ))}
              </Stack>
            ) : (
              <ChatLoading />
            )}
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

      {/* -------------------- DRAWERS & MENUS -------------------- */}

      {/* Search Drawer */}
      <SearchDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: "12px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ProfileModal user={user}>
          <MenuItem sx={{ py: 1.5, borderRadius: "8px", mx: 1 }}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: COLORS.accent }} />
            <Typography variant="body2" fontWeight={500}>My Profile</Typography>
          </MenuItem>
        </ProfileModal>
        <Divider sx={{ my: 1, borderColor: mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }} />
        <MenuItem 
          onClick={logoutHandler}
          sx={{ py: 1.5, borderRadius: "8px", mx: 1, color: COLORS.error }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>



    </Box>
  );
};

export default ChatPage;
