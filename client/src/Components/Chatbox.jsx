import { Box, useMediaQuery } from "@mui/material";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  const isMobile = useMediaQuery("(max-width:768px)");

  if (isMobile && !selectedChat) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        bgcolor: "#fff",
        width: { xs: "100%", md: "68%" },
        borderRadius: "12px",
        border: "1px solid #ccc",
        height: "100%",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
