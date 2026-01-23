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
  Typography,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import axios from "../../axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";
import { toast } from "react-toastify";
import socket from "../../socket";

const GroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
  const { mode } = useThemeMode();
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [adminSelectDialogOpen, setAdminSelectDialogOpen] = useState(false);

  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  
  // Check if this is for viewing/editing existing group
  const isViewMode = fetchAgain !== undefined && selectedChat?.isGroupChat;

  const handleOpen = () => {
    setOpen(true);
    if (isViewMode) {
      setGroupChatName(selectedChat.chatName || "");
      setSelectedUsers(selectedChat.users || []);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsAddingMember(false);
    setSearch("");
    setSearchResult([]);
    setLeaveDialogOpen(false);
    setAdminSelectDialogOpen(false);
    if (!isViewMode) {
      setGroupChatName("");
      setSelectedUsers([]);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        const fetchUsers = async () => {
          try {
            setLoading(true);
            const config = {
              headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);
          } catch (error) {
            toast.error("Failed to load search results");
            setLoading(false);
          }
        };
        fetchUsers();
      } else {
        setSearchResult([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, user.token]);

  const handleSearch = (query) => {
    setSearch(query);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleRemoveMember = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast.error("Only admin can remove members");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("Member removed successfully");
      handleClose();
    } catch (error) {
      toast.error("Error removing member");
    }
  };

  const handleAddMember = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can add members");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setIsAddingMember(false);
      setSearch("");
      setSearchResult([]);
      toast.success("Member added successfully");
      
      // Emit socket event for group member addition
      socket.emit("user added to group", {
        groupId: selectedChat._id,
        groupName: selectedChat.chatName,
        userId: userToAdd._id,
        addedBy: user.name,
      });
    } catch (error) {
      toast.error("Error adding member");
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast.success("Group name updated");
    } catch (error) {
      toast.error("Error renaming group");
      setRenameLoading(false);
    }
  };

  const handleLeaveClick = () => {
    setLeaveDialogOpen(true);
  };

  const handleConfirmLeave = () => {
    setLeaveDialogOpen(false);
    const isAdmin = selectedChat.groupAdmin._id === user._id;
    // Check if there are other members besides self (users array includes self)
    const otherMembers = selectedChat.users.filter(u => u._id !== user._id);
    
    if (isAdmin && otherMembers.length > 0) {
      setAdminSelectDialogOpen(true);
    } else {
      // Regular member or Admin with no other members -> just leave
      handleRemoveMember(user);
    }
  };

  const handlePromoteAndLeave = async (newAdmin) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      // 1. Promote new admin
      await axios.put(
        `/api/chat/groupadmin`,
        {
          chatId: selectedChat._id,
          userId: newAdmin._id,
        },
        config
      );

      // 2. Remove self
      await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );

      setSelectedChat();
      setFetchAgain(!fetchAgain);
      setAdminSelectDialogOpen(false);
      handleClose();
      toast.success("Left group successfully");
    } catch (error) {
      toast.error("Error leaving group");
    }
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
      
      // Emit socket event for group creation
      socket.emit("group created", {
        group: data,
        members: data.users.map((u) => u._id),
      });
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
          {isViewMode ? "Group Info" : "Create Group Chat"}
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
            {isViewMode ? (
              <>
                {/* Group Name - Editable for admin */}
                <Box>
                  <TextField
                    fullWidth
                    label="Group Name"
                    variant="outlined"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    disabled={selectedChat.groupAdmin._id !== user._id}
                  />
                  {selectedChat.groupAdmin._id === user._id && (
                    <Button
                      size="small"
                      onClick={handleRename}
                      disabled={renameLoading}
                      sx={{ mt: 1 }}
                    >
                      {renameLoading ? "Updating..." : "Update Name"}
                    </Button>
                  )}
                </Box>

                {/* Current Members */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Members ({selectedChat.users.length})
                  </Typography>
                  <Stack spacing={1} sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {selectedChat.users.map((member) => (
                      <Box
                        key={member._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.5,
                          borderRadius: 2,
                          background: mode === "dark" ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar src={member.pic} sx={{ width: 36, height: 36 }}>
                            {member.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {member.name}
                              {member._id === selectedChat.groupAdmin._id && (
                                <Chip
                                  label="Admin"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    height: 20,
                                    fontSize: "0.7rem",
                                    background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
                                    color: "#fff",
                                  }}
                                />
                              )}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {member.email}
                            </Typography>
                          </Box>
                        </Box>
                        {selectedChat.groupAdmin._id === user._id && member._id !== user._id && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveMember(member)}
                            sx={{ color: "#EF4444" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Add Member Section */}
                {selectedChat.groupAdmin._id === user._id && (
                  <Box>
                    {!isAddingMember ? (
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddingMember(true)}
                        fullWidth
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        Add Member
                      </Button>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          label="Search users"
                          variant="outlined"
                          value={search}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        {loading ? (
                          <Box display="flex" justifyContent="center" py={2}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : (
                          <Box sx={{ mt: 1, maxHeight: 150, overflowY: "auto" }}>
                            {searchResult.slice(0, 4).map((u) => (
                              <UserListItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleAddMember(u)}
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <>
                {/* Create Group Mode */}
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
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          {!isViewMode && (
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
          )}
          {isViewMode && (
            <Button
              variant="contained"
              color="error"
              onClick={handleLeaveClick}
              size="large"
              sx={{
                borderRadius: "8px",
                px: 4,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Leave Group
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Leave Confirmation Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            p: 1,
            minWidth: 300,
          }
        }}
      >
        <DialogTitle sx={{ color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight }}>
          Leave Group?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight }}>
            Are you sure you want to leave this group?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmLeave} color="error" variant="contained">Leave</Button>
        </DialogActions>
      </Dialog>

      {/* Admin Selection Dialog */}
      <Dialog
        open={adminSelectDialogOpen}
        onClose={() => setAdminSelectDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            p: 1,
            minWidth: 350,
            maxHeight: 500,
          }
        }}
      >
        <DialogTitle sx={{ color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight }}>
          Select New Admin
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2, color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight }}>
            Before you leave, please select a new admin for the group:
          </Typography>
          <Stack spacing={1}>
            {selectedChat?.users
              .filter(u => u._id !== user._id)
              .map(u => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handlePromoteAndLeave(u)}
                />
              ))
            }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminSelectDialogOpen(false)} color="inherit">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
