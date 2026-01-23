import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockResetOutlined,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "../../axios";
import { COLORS } from "../../constants";
import { useThemeMode } from "../../Context/ThemeProvider";

const ForgotPasswordModal = ({ open, onClose }) => {
  const { mode } = useThemeMode();
  const [step, setStep] = useState(1); // 1: Email, 2: Code & Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  const validateEmail = () => {
    const temp = {};
    if (!email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) temp.email = "Email is invalid";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const validateReset = () => {
    const temp = {};
    if (!code) temp.code = "Verification code is required";
    else if (code.length !== 6) temp.code = "Code must be 6 digits";
    if (!newPassword) temp.newPassword = "New password is required";
    else if (newPassword.length < 6)
      temp.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword) temp.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword)
      temp.confirmPassword = "Passwords do not match";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        "/api/user/forgot-password",
        { email: email.trim() },
        config
      );
      toast.success(data.message || "Reset code sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateReset()) return;

    setLoading(true);
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        "/api/user/reset-password",
        {
          email: email.trim(),
          code: code.trim(),
          newPassword,
        },
        config
      );
      toast.success(data.message || "Password reset successful!");
      handleClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: mode === "dark" ? COLORS.backgroundDark : "#FFFFFF",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: `1px solid ${
            mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "#E5E7EB"
          }`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step === 1 ? (
              <EmailOutlined sx={{ color: "#FFFFFF", fontSize: 22 }} />
            ) : (
              <LockResetOutlined sx={{ color: "#FFFFFF", fontSize: 22 }} />
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color:
                mode === "dark"
                  ? COLORS.textPrimaryDark
                  : COLORS.textPrimaryLight,
            }}
          >
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color:
              mode === "dark"
                ? COLORS.textSecondaryDark
                : COLORS.textSecondaryLight,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {step === 1 ? (
          <Stack spacing={3}>
            <Typography
              variant="body2"
              sx={{
                color:
                  mode === "dark"
                    ? COLORS.textSecondaryDark
                    : COLORS.textSecondaryLight,
                mb: 1,
              }}
            >
              Enter your email address and we'll send you a verification code to
              reset your password.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              error={!!errors.email}
              helperText={errors.email}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#F9FAFB",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor:
                      mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#F3F4F6",
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSendCode}
              disabled={loading}
              sx={{
                height: 48,
                fontWeight: 600,
                background:
                  mode === "dark"
                    ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                    : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
                boxShadow:
                  mode === "dark"
                    ? "0 4px 14px 0 rgba(59, 130, 246, 0.4)"
                    : "0 4px 14px 0 rgba(15, 23, 42, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow:
                    mode === "dark"
                      ? "0 6px 20px 0 rgba(59, 130, 246, 0.5)"
                      : "0 6px 20px 0 rgba(15, 23, 42, 0.4)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Typography
              variant="body2"
              sx={{
                color:
                  mode === "dark"
                    ? COLORS.textSecondaryDark
                    : COLORS.textSecondaryLight,
                mb: 1,
              }}
            >
              We've sent a 6-digit verification code to{" "}
              <strong>{email}</strong>. Enter the code below along with your new
              password.
            </Typography>
            <TextField
              fullWidth
              label="6-Digit Verification Code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(value);
                setErrors({ ...errors, code: "" });
              }}
              error={!!errors.code}
              helperText={errors.code}
              inputProps={{ maxLength: 6 }}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#F9FAFB",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.5em",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors({ ...errors, newPassword: "" });
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#F9FAFB",
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: "" });
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor:
                    mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#F9FAFB",
                },
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => setStep(1)}
                sx={{
                  height: 48,
                  fontWeight: 600,
                  borderColor: COLORS.accent,
                  color: COLORS.accent,
                  "&:hover": {
                    borderColor: COLORS.accentHover,
                    bgcolor:
                      mode === "dark"
                        ? "rgba(59, 130, 246, 0.1)"
                        : "rgba(59, 130, 246, 0.05)",
                  },
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleResetPassword}
                disabled={loading}
                sx={{
                  height: 48,
                  fontWeight: 600,
                  background:
                    mode === "dark"
                      ? `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`
                      : `linear-gradient(135deg, ${COLORS.primary} 0%, #1E40AF 100%)`,
                  boxShadow:
                    mode === "dark"
                      ? "0 4px 14px 0 rgba(59, 130, 246, 0.4)"
                      : "0 4px 14px 0 rgba(15, 23, 42, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      mode === "dark"
                        ? "0 6px 20px 0 rgba(59, 130, 246, 0.5)"
                        : "0 6px 20px 0 rgba(15, 23, 42, 0.4)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
