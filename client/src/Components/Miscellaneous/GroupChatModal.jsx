import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "../../axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";
import { toast } from "react-toastify";

const GroupChatModal = ({ children }) => {
  const { mode } = useThemeMode();
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results");
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.warning("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      toast.success("New group chat created!");
    } catch (error) {
      toast.error("Error creating chat");
    }
  };

  return (
    <>
      <span onClick={handleOpen} style={{ cursor: "pointer" }}>
        {children}
      </span>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            backgroundImage: "none",
            border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          }
        }}
      >
        <DialogTitle
          sx={{ 
            fontSize: "1.25rem", 
            fontWeight: 700,
            textAlign: "center",
            borderBottom: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            p: 3,
            color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
          }}
        >
          Create Group Chat
          <IconButton
            onClick={handleClose}
            sx={{ 
              position: "absolute", 
              right: 12, 
              top: 12,
              color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Chat Name"
              variant="outlined"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Add Users eg: John, Piyush, Jane"
              variant="outlined"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Box display="flex" flexWrap="wrap" gap={1}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="large"
            sx={{
              background: mode === "dark" 
                ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
              color: "#fff",
              "&:hover": {
                background: mode === "dark" 
                  ? `linear-gradient(135deg, ${COLORS.accentHover} 0%, ${COLORS.accent} 100%)`
                  : `linear-gradient(135deg, #1E293B 0%, #334155 100%)`,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              },
              borderRadius: "8px",
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            Create Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
