import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  Divider,
  InputBase,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../Config/ChatLogics";

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
      alert("Failed to load search results");
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
      alert("Error fetching the chat");
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
        sx={{
          backgroundColor: "white",
          borderBottom: "4px solid #2C3E50",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Tooltip title="Search Users to chat" placement="bottom-end">
            <Button
              variant="text"
              startIcon={<SearchIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                color: "#2C3E50",
                textTransform: "none",
                fontFamily: "Poppins",
              }}
            >
              <Typography sx={{ display: { xs: "none", md: "inline" } }}>
                Search User
              </Typography>
            </Button>
          </Tooltip>

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              color: "#2C3E50",
              fontWeight: 600,
            }}
          >
            Chat-o-Philic
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              color="default"
            >
              <Badge
                badgeContent={notification.length}
                color="error"
                overlap="circular"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={() => setNotifAnchorEl(null)}
            >
              {!notification.length && <MenuItem>No New Messages</MenuItem>}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                    setNotifAnchorEl(null);
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </Menu>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                alt={user.name}
                src={user.pic}
                sx={{ width: 36, height: 36 }}
              />
              <ExpandMoreIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <Divider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={300} p={2}>
          <Typography variant="h6" sx={{ fontFamily: "Poppins", mb: 2 }}>
            Search Users
          </Typography>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: "2px 4px",
              border: "1px solid #ccc",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          {loading ? (
            <ChatLoading />
          ) : (
            <List>
              {searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))}
            </List>
          )}
          {loadingChat && (
            <CircularProgress sx={{ display: "block", mx: "auto" }} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
