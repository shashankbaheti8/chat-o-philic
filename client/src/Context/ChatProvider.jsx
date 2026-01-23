import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);
    if (!storedUser) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (notification.length > 0) {
      document.title = `(${notification.length}) New Messages | Chat-o-Philic`;
    } else {
      document.title = "Chat-o-Philic";
    }
  }, [notification]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
