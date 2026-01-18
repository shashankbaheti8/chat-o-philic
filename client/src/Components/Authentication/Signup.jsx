import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Name is required";
    if (!form.email) tempErrors.email = "Email is required";
    if (!form.password) tempErrors.password = "Password is required";
    if (!form.confirmpassword)
      tempErrors.confirmpassword = "Confirm Password is required";
    if (
      form.password &&
      form.confirmpassword &&
      form.password !== form.confirmpassword
    )
      tempErrors.confirmpassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const postDetails = (file) => {
    setUploadingPic(true);
    if (!file) {
      toast.error("Please select an image");
      setUploadingPic(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_PRESET_NAME);
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

      fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setUploadingPic(false);
          toast.success("Image uploaded");
        })
        .catch(() => {
          setUploadingPic(false);
          toast.error("Upload failed");
        });
    } else {
      toast.error("Please select a JPEG or PNG");
      setUploadingPic(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          ...form,
          pic,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Account created successfully");
      navigate("/chats");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Box
          sx={{
            position: "relative",
            "&:hover .upload-overlay": {
              opacity: 1,
            }
          }}
        >
          <Avatar
            src={pic}
            alt="Profile"
            sx={{ 
              width: 90, 
              height: 90,
              bgcolor: mode === "dark" ? COLORS.surfaceDark : COLORS.surfaceLight,
              boxShadow: `0 4px 12px rgba(59, 130, 246, 0.2)`,
            }}
          />
        </Box>
        <Button
          variant="outlined"
          component="label"
          size="small"
          startIcon={uploadingPic ? <CircularProgress size={16} /> : <CloudUpload />}
          disabled={uploadingPic}
          sx={{
            borderColor: COLORS.accent,
            color: COLORS.accent,
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: COLORS.accentHover,
              bgcolor: mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
              transform: "translateY(-2px)",
              boxShadow: `0 4px 12px rgba(59, 130, 246, 0.2)`,
            },
          }}
        >
          {uploadingPic ? "Uploading..." : "Upload Picture"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        autoComplete="name"
        autoFocus
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.accent,
              }
            },
            "&.Mui-focused": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              boxShadow: `0 0 0 3px ${mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
            }
          },
        }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        autoComplete="email"
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.accent,
              }
            },
            "&.Mui-focused": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              boxShadow: `0 0 0 3px ${mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
            }
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        autoComplete="new-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={() => setShowPassword(!showPassword)} 
                edge="end"
                sx={{
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  }
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.accent,
              }
            },
            "&.Mui-focused": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              boxShadow: `0 0 0 3px ${mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
            }
          },
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmpassword"
        type={showPassword ? "text" : "password"}
        value={form.confirmpassword}
        onChange={handleChange}
        error={!!errors.confirmpassword}
        helperText={errors.confirmpassword}
        autoComplete="new-password"
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: COLORS.accent,
              }
            },
            "&.Mui-focused": {
              bgcolor: mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
              boxShadow: `0 0 0 3px ${mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
            }
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          mt: 2,
          height: 52,
          fontWeight: 600,
          fontSize: "1rem",
          background: mode === "dark" 
            ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
            : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
          boxShadow: mode === "dark"
            ? "0 4px 14px 0 rgba(59, 130, 246, 0.4)"
            : "0 4px 14px 0 rgba(15, 23, 42, 0.3)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: mode === "dark" 
              ? `linear-gradient(135deg, ${COLORS.accentHover} 0%, ${COLORS.accent} 100%)`
              : `linear-gradient(135deg, #1E293B 0%, #334155 100%)`,
            boxShadow: mode === "dark"
              ? "0 6px 20px 0 rgba(59, 130, 246, 0.5)"
              : "0 6px 20px 0 rgba(15, 23, 42, 0.4)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&:disabled": {
            background: mode === "dark" ? COLORS.surfaceDark : "#E2E8F0",
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
      </Button>
    </Stack>
  );
};

export default Signup;
