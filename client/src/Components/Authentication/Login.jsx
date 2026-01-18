import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Stack,
  CircularProgress,
  keyframes,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mode } = useThemeMode();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const temp = {};
    if (!form.email) temp.email = "Email is required";
    if (!form.password) temp.password = "Password is required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post("/api/user/login", form, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful");
      navigate("/chats");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        error={!!errors.email}
        helperText={errors.email}
        autoComplete="email"
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
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        error={!!errors.password}
        helperText={errors.password}
        autoComplete="current-password"
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
        <Button
          variant="text"
          size="small"
          sx={{ 
            textTransform: "none", 
            color: COLORS.accent,
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              color: COLORS.accentHover,
              backgroundColor: "transparent",
              transform: "translateX(2px)",
            }
          }}
        >
          Forgot password?
        </Button>
      </Box>

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
        {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
      </Button>
    </Stack>
  );
};

export default Login;
