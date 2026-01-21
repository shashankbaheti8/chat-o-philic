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
  Notifications as NotificationsIcon,
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
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const { 
    user, 
    selectedChat, 
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification
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

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.warning("Please enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat");
      setLoadingChat(false);
    }
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

          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => setNotifAnchorEl(e.currentTarget)}
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
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            borderRight: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
          }
        }}
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>Search Users</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Name or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                }
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              sx={{ 
                minWidth: "auto", 
                px: 2,
                borderRadius: "12px",
                background: COLORS.accent 
              }}
            >
              Go
            </Button>
          </Box>

          {loading ? (
            <ChatLoading />
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <Stack spacing={1}>
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {loadingChat && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Drawer>

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

      {/* Notifications Menu */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            maxHeight: 400,
            borderRadius: "12px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography 
          variant="subtitle2" 
          fontWeight={700} 
          sx={{ p: 2, borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}` }}
        >
          Notifications
        </Typography>
        {!notification.length && (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No new notifications</Typography>
          </Box>
        )}
        {notification.map((notif) => (
          <MenuItem
            key={notif._id}
            onClick={() => {
              setSelectedChat(notif.chat);
              setNotification(notification.filter((n) => n !== notif));
              setNotifAnchorEl(null);
            }}
            sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}
          >
            {notif.chat.isGroupChat
              ? `New message in ${notif.chat.chatName}`
              : `New message from ${getSender(user, notif.chat.users)}`}
          </MenuItem>
        ))}
      </Menu>

    </Box>
  );
};

export default ChatPage;
