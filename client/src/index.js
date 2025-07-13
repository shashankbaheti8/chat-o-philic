import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#E67E22", // Accent color (soft orange)
    },
    background: {
      default: "#F4F6F8", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#333", // Dark text
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
