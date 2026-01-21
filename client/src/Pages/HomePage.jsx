import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  keyframes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  ChatBubbleOutlineRounded, 
  GroupsRounded, 
  SecurityRounded 
} from "@mui/icons-material";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useThemeMode } from "../Context/ThemeProvider";
import { COLORS } from "../constants";



// Fade in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function Homepage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const features = [
    {
      icon: ChatBubbleOutlineRounded,
      title: "Instant Messaging",
      description: "Real-time chat with typing indicators and read receipts"
    },
    {
      icon: GroupsRounded,
      title: "Group Conversations",
      description: "Create groups and collaborate with your team"
    },
    {
      icon: SecurityRounded,
      title: "Secure & Private",
      description: "Your messages are encrypted and secure"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: mode === "dark" ? COLORS.backgroundDark : "#F8FAFC",
      }}
    >
      {/* Left Side - Branding with Animated Gradient */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 8,
          position: "relative",
          overflow: "hidden",
          background: mode === "dark" 
            ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
            : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
          color: "#FFFFFF",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: mode === "dark"
              ? "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)"
              : "radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "3.5rem",
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: `${fadeIn} 0.8s ease-out`,
            }}
          >
            Chat-o-Philic
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 400,
              mb: 8,
              opacity: 0.95,
              maxWidth: 450,
              lineHeight: 1.6,
              animation: `${fadeIn} 0.8s ease-out 0.2s backwards`,
            }}
          >
            Modern real-time messaging platform for teams and individuals
          </Typography>

          <Stack spacing={3} sx={{ maxWidth: 450 }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2.5,
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: `${fadeIn} 0.8s ease-out ${0.4 + index * 0.15}s backwards`,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.08)",
                      transform: "translateX(8px)",
                      borderColor: COLORS.accent,
                      boxShadow: `0 8px 24px rgba(59, 130, 246, 0.2)`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "10px",
                      background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: `0 4px 12px rgba(59, 130, 246, 0.3)`,
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color: "#FFFFFF" }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, fontSize: "1.1rem" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.5 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Auth Form with Premium Styling */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.8 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
          py: 6,
        }}
      >
        <Box 
          sx={{ 
            width: "100%", 
            maxWidth: 420,
            animation: `${fadeIn} 0.8s ease-out 0.3s backwards`,
          }}
        >
          {/* Logo for mobile with gradient */}
          <Box sx={{ display: { xs: "block", md: "none" }, mb: 5, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: mode === "dark" 
                  ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                  : `linear-gradient(135deg, ${COLORS.primary} 0%, #3B82F6 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Chat-o-Philic
            </Typography>
          </Box>

          {/* Tabs with better styling */}
          <Tabs
            value={value}
            onChange={handleTabChange}
            sx={{
              mb: 4,
              minHeight: 48,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
                background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
              },
              "& .MuiTab-root": {
                minHeight: 48,
                fontSize: "0.95rem",
                fontWeight: 600,
                textTransform: "none",
                color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
                },
                "&:hover": {
                  color: COLORS.accent,
                }
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Forms */}
          {value === 0 ? <Login /> : <Signup />}
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
