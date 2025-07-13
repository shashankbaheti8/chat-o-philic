import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import axios from "../axios";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import { getSender } from "../Config/ChatLogics";
import ChatLoading from "./ChatLoading";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [snackbar, setSnackbar] = useState(null);

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      setSnackbar({
        message: "Failed to load the chats",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <Paper
      elevation={3}
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#fff",
        width: { xs: "100%", md: "31%" },
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingBottom={2}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins",
            color: "#2C3E50",
          }}
        >
          My Chats
        </Typography>
        <GroupChatModal>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              backgroundColor: "#E67E22",
              "&:hover": {
                backgroundColor: "#d35400",
              },
              borderRadius: "20px",
              textTransform: "none",
              fontFamily: "Poppins",
            }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        sx={{
          backgroundColor: "#F4F6F8",
          width: "100%",
          flex: 1,
          borderRadius: 2,
          overflowY: "auto",
          padding: 1,
        }}
      >
        {chats ? (
          <Stack spacing={1}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedChat === chat ? "#2C3E50" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "#333",
                  padding: "8px 12px",
                  borderRadius: 2,
                  fontFamily: "Poppins",
                }}
              >
                <Typography variant="subtitle2">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                {chat.latestMessage && (
                  <Typography variant="caption">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {snackbar && (
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </Paper>
  );
};

export default MyChats;
