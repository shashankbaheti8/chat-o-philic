import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);
