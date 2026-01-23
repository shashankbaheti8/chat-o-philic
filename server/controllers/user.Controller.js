const asyncHandler = require("express-async-handler");
const User = require("../models/user.Model");
const generateToken = require("../utils/generateToken");
const { sendResetCode } = require("../utils/emailService");
const crypto = require("crypto");


const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" }
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  // Sanitize email
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// Forgot Password - Generate and send reset code
const forgotPassword = asyncHandler(async (req, res) => {
  let { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  // Sanitize email
  email = email.toLowerCase().trim();

  let user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No account found with this email address");
  }

  // Generate 6-digit code
  const resetCode = crypto.randomInt(100000, 999999).toString();

  user.resetPasswordToken = resetCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send email
  try {
    await sendResetCode(user.email, resetCode, user.name);
    res.json({
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(500);
    throw new Error("Failed to send email. Please try again later.");
  }
});

// Reset Password - Verify code and update password
const resetPassword = asyncHandler(async (req, res) => {
  let { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400);
    throw new Error("Email, code, and new password are required");
  }

  // Sanitize email
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No account found with this email address");
  }

  // Check if code matches and hasn't expired
  if (!user.resetPasswordToken || !user.resetPasswordExpires) {
    res.status(400);
    throw new Error("No password reset request found. Please request a new code.");
  }

  if (user.resetPasswordToken !== code) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  if (Date.now() > user.resetPasswordExpires) {
    res.status(400);
    throw new Error("Verification code has expired. Please request a new code.");
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({
    message: "Password reset successful. You can now login with your new password.",
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

module.exports = { 
  allUsers, 
  registerUser, 
  authUser, 
  forgotPassword, 
  resetPassword,
  updateUserProfile 
};
