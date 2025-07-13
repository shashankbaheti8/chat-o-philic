import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";

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
  const navigate = useNavigate();

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
    setLoading(true);
    if (!file) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_PRESET_NAME); // your preset name here
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME); // your cloud name here

      fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      alert("Please select a JPEG or PNG image!");
      setLoading(false);
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
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt={5}
      p={3}
      borderRadius={3}
      boxShadow={3}
      bgcolor="#fff"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
        Create Your Account
      </Typography>

      <Stack spacing={2}>
        <Box display="flex" justifyContent="center">
          <Avatar
            src={pic}
            alt="Profile"
            sx={{ width: 62, height: 62, mb: 1 }}
          />
        </Box>

        <Button variant="outlined" component="label">
          Upload Profile Picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Button>

        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          name="confirmpassword"
          type={showPassword ? "text" : "password"}
          value={form.confirmpassword}
          onChange={handleChange}
          error={!!errors.confirmpassword}
          helperText={errors.confirmpassword}
          fullWidth
        />

        {loading ? (
          <Box textAlign="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#E67E22", ":hover": { bgcolor: "#d35400" } }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Signup;
