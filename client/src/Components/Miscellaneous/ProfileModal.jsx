import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Button,
  Box,
  Stack,
  CircularProgress,
  Badge,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import axios from "../../axios";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";
import { CloudUpload } from "@mui/icons-material";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [picUrl, setPicUrl] = useState(user.pic || "/pp.jpg");
  const [loading, setLoading] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  const { user: loggedInUser, setUser } = ChatState();
  const { mode } = useThemeMode();

  const isMyProfile = loggedInUser?._id === user._id;

  const handleOpen = () => {
    setOpen(true);
    setPicUrl(user.pic || "/pp.jpg");
    setIsEditing(false);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const postDetails = (file) => {
    setUploadingPic(true);
    if (!file) {
      toast.warning("Please select an image");
      setUploadingPic(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", import.meta.env.VITE_PRESET_NAME);
      data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicUrl(data.secure_url.toString());
          setUploadingPic(false);
          toast.success("Image uploaded successfully");
        })
        .catch((err) => {
          console.error(err);
          setUploadingPic(false);
          toast.error("Image upload failed");
        });
    } else {
      toast.error("Please select a JPEG or PNG image");
      setUploadingPic(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!picUrl) {
      toast.warning("Please provide an image URL");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/user/profile",
        { pic: picUrl },
        config
      );

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen} size="small">
          <VisibilityIcon />
        </IconButton>
      )}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background: mode === "dark" ? COLORS.surfaceDark : "#FFFFFF",
            backgroundImage: "none",
            overflow: "hidden",
            boxShadow: mode === "dark" 
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
              : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }
        }}
      >
        {/* Header Background */}
        <Box
          sx={{
            height: 140,
            width: "100%",
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            pr: 2
          }}
        >
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -8, // Pull content up over the header
            pb: 5,
            px: 4,
          }}
        >
          {/* Avatar Section */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              isEditing && isMyProfile && (
                <IconButton
                  component="label"
                  sx={{
                    bgcolor: COLORS.accent,
                    color: "#fff",
                    border: `4px solid ${mode === "dark" ? COLORS.surfaceDark : "#FFFFFF"}`,
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    "&:hover": { bgcolor: COLORS.accentHover },
                    transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  {uploadingPic ? <CircularProgress size={24} color="inherit" /> : <CloudUpload sx={{ fontSize: 24 }} />}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                  />
                </IconButton>
              )
            }
          >
            <Avatar
              alt={user.name}
              src={isEditing ? picUrl : user.pic}
              sx={{ 
                width: 160, 
                height: 160,
                border: `6px solid ${mode === "dark" ? COLORS.surfaceDark : "#FFFFFF"}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                bgcolor: COLORS.surfaceLight,
                transition: "all 0.3s ease",
              }}
            />
          </Badge>

          {/* User Info */}
          <Box sx={{ mt: 3, width: "100%", textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: mode === "dark" ? COLORS.textPrimaryDark : COLORS.textPrimaryLight,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.5px",
                mb: 1,
              }}
            >
              {user.name}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              {user.email}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 5, width: "100%", display: "flex", justifyContent: "center" }}>
            {isMyProfile && (isEditing ? (
              <Fade in={isEditing}>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setIsEditing(false);
                      setPicUrl(user.pic || "/pp.jpg"); // Reset to original
                    }}
                    disabled={loading}
                    sx={{
                      borderRadius: "12px",
                      px: 3,
                      py: 1,
                      borderWidth: "2px",
                      borderColor: mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                      color: mode === "dark" ? COLORS.textSecondaryDark : COLORS.textSecondaryLight,
                      fontWeight: 600,
                      "&:hover": {
                        borderWidth: "2px",
                        bgcolor: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleUpdateProfile}
                    disabled={loading || uploadingPic}
                    sx={{
                      borderRadius: "12px",
                      px: 4,
                      py: 1,
                      bgcolor: COLORS.accent,
                      boxShadow: `0 8px 16px ${mode === "dark" ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.25)"}`,
                      fontWeight: 700,
                      "&:hover": { 
                        bgcolor: COLORS.accentHover,
                        transform: "translateY(-1px)",
                        boxShadow: `0 12px 20px ${mode === "dark" ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.35)"}`,
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Fade>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: 1,
                  borderWidth: "2px",
                  borderColor: COLORS.accent,
                  color: COLORS.accent,
                  fontWeight: 600,
                  "&:hover": {
                    borderWidth: "2px",
                    bgcolor: `rgba(${parseInt(COLORS.accent.slice(1,3),16)}, ${parseInt(COLORS.accent.slice(3,5),16)}, ${parseInt(COLORS.accent.slice(5,7),16)}, 0.08)`,
                  }
                }}
              >
                Edit Profile
              </Button>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileModal;
