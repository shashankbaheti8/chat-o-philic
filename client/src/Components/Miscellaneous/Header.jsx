import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  Box,
  Avatar,
  CircularProgress,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../axios";
import axios from "../../axios";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import SearchDrawer from "./SearchDrawer";
import { getSender } from "../../Config/ChatLogics";
import { COLORS } from "../../constants";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const {
    user,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "transparent",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 3 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mr: "auto",
            }}
          >
            Chat-o-Philic
          </Typography>

          {/* Search Icon */}
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              mr: 1,
              color: COLORS.textSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <SearchIcon />
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: COLORS.textSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: COLORS.accent,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              alt={user.name}
              src={user.pic}
              sx={{ 
                width: 32, 
                height: 32,
                border: `2px solid transparent`,
                transition: "border-color 0.2s ease",
                "&:hover": {
                  borderColor: COLORS.accent,
                }
              }}
            />
          </IconButton>

          {/* Profile Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: "background.paper",
                mt: 1,
                minWidth: 200,
              },
            }}
          >
            <ProfileModal user={user}>
              <MenuItem
                sx={{
                  color: COLORS.textPrimary,
                  "&:hover": {
                    backgroundColor: "rgba(0, 229, 255, 0.1)",
                  },
                }}
              >
                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                My Profile
              </MenuItem>
            </ProfileModal>
            <Divider sx={{ borderColor: COLORS.divider }} />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setLogoutDialogOpen(true);
              }}
              sx={{
                color: COLORS.secondary,
                "&:hover": {
                  backgroundColor: "rgba(255, 77, 141, 0.1)",
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={logoutDialogOpen}
            onClose={() => setLogoutDialogOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: "16px",
                background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
                backgroundImage: "none",
                p: 2,
              }
            }}
          >
            <DialogTitle sx={{ color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight }}>
              Confirm Logout
            </DialogTitle>
            <Typography sx={{ px: 3, pb: 2, color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight }}>
              Are you sure you want to log out?
            </Typography>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={() => setLogoutDialogOpen(false)}
                sx={{ color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setLogoutDialogOpen(false);
                  logoutHandler();
                }}
                variant="contained"
                sx={{
                  bgcolor: COLORS.secondary,
                  "&:hover": { bgcolor: "#D91B60" },
                  borderRadius: "8px",
                }}
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>


        </Toolbar>
      </AppBar>

      {/* Search Drawer */}
      <SearchDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </>
  );
};

export default Header;
