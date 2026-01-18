import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  Box,
  Avatar,
  CircularProgress,
  TextField,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../Config/ChatLogics";
import { COLORS } from "../../constants";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      console.error("Search failed");
    } finally {
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
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error creating chat");
    } finally {
      setLoadingChat(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 3 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mr: "auto",
            }}
          >
            Chat-o-Philic
          </Typography>

          {/* Search Icon */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              mr: 1,
              color: COLORS.textSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <SearchIcon />
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={(e) => setNotifAnchorEl(e.currentTarget)}
            sx={{
              mr: 1,
              color: COLORS.textSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <Badge
              badgeContent={notification.length}
              sx={{
                "& .MuiBadge-badge": {
                  background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`,
                  boxShadow: `0 0 8px ${COLORS.secondary}`,
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: COLORS.textSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              alt={user.name}
              src={user.pic}
              sx={{ 
                width: 32, 
                height: 32,
                border: `2px solid transparent`,
                transition: "border-color 0.2s ease",
                "&:hover": {
                  borderColor: COLORS.accent,
                }
              }}
            />
          </IconButton>

          {/* Profile Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: "background.paper",
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            <ProfileModal user={user}>
              <MenuItem
                sx={{
                  color: COLORS.textPrimary,
                  "&:hover": {
                    backgroundColor: "rgba(0, 229, 255, 0.1)",
                  },
                }}
              >
                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                My Profile
              </MenuItem>
            </ProfileModal>
            <Divider sx={{ borderColor: COLORS.divider }} />
            <MenuItem
              onClick={logoutHandler}
              sx={{
                color: COLORS.secondary,
                "&:hover": {
                  backgroundColor: "rgba(255, 77, 141, 0.1)",
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={() => setNotifAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: "background.paper",
                mt: 1,
                minWidth: 300,
                maxHeight: 400,
              },
            }}
          >
            {!notification.length && (
              <MenuItem disabled sx={{ color: COLORS.textSecondary }}>
                No new notifications
              </MenuItem>
            )}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                  setNotifAnchorEl(null);
                }}
                sx={{
                  color: COLORS.textPrimary,
                  "&:hover": {
                    backgroundColor: "rgba(0, 229, 255, 0.1)",
                  },
                }}
              >
                {notif.chat.isGroupChat
                  ? `New message in ${notif.chat.chatName}`
                  : `New message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Search Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            background: COLORS.backgroundSecondary,
            borderRight: `1px solid ${COLORS.borderSubtle}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 3,
            }}
          >
            Search Users
          </Typography>

          <TextField
            fullWidth
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: COLORS.textSecondary }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {loading ? (
            <ChatLoading />
          ) : (
            <Stack spacing={1}>
              {searchResult?.map((searchUser) => (
                <UserListItem
                  key={searchUser._id}
                  user={searchUser}
                  handleFunction={() => accessChat(searchUser._id)}
                />
              ))}
            </Stack>
          )}
          {loadingChat && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
