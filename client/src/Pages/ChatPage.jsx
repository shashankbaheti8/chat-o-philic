import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Chatbox from "../Components/Chatbox";
import MyChats from "../Components/MyChats";
import Header from "../Components/Miscellaneous/Header";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/");
      }
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100vh", bgcolor: "#F4F6F8" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91.5vh",
          p: 1.5,
          gap: 2,
        }}
      >
        <MyChats fetchAgain={fetchAgain} />
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </Box>
  );
};

export default ChatPage;
