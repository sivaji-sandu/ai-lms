// 
import { genToken } from "../configs/token.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendMail from "../configs/Mail.js";
import generateOTP from "../utils/otp.js";
// ---------- Normal Signup ----------
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(name);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existUser = await User.findOne({ email: normalizedEmail });

    if (existUser && existUser.isOtpVerifed) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If user exists but not verified → delete and allow re-signup
    if (existUser) {
      await User.deleteOne({ email: normalizedEmail });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
      resetOtp: otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 mins
      isOtpVerifed: false,
      role,
    });
    console.log(user);
    // Send OTP email
    await sendMail(normalizedEmail, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({
      message: `SignUp Error: ${error.message}`,
    });
  }
};
// ---------- Normal Login ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("login error", error);
    return res.status(500).json({ message: `Login Error: ${error.message}` });
  }
};

// ---------- Logout ----------
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error: ${error.message}` });
  }
};

// ---------- Google Auth ----------
export const googleSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role: role || "student",
        password: null, // no password for google users
      });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("googleSignup error", error);
    return res.status(500).json({ message: `Google Auth Error: ${error.message}` });
  }
};

// ---------- OTP + Reset (unchanged) ----------
export const sendOtp = async (req, res) => { 
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    
    if (!existingUser)
      return res.status(400).json({ success: false, message: 'Email not exists' });

    const otp = generateOTP();
    existingUser.resetOtp = otp;
    existingUser.otpExpires = Date.now() + 10 * 60 * 1000;

    console.log(existingUser);

    await existingUser.save();

   await sendMail(email,otp);

    res.status(201).json({ success: true, message: "OTP generated successfully" });
  } catch (err) {
    console.error('OTP GENERATION ERROR:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const verifyOtp = async (req, res) => { 
  const { email, otp } = req.body;

  try {
    // 1️⃣ Check if email and otp are provided
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // 3️⃣ Check if OTP matches
    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 4️⃣ Check if OTP is expired
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // 5️⃣ OTP is valid → clear OTP fields
    user.resetOtp = null;
    user.otpExpires = null;
    user.isOtpVerifed=true;
    await user.save();

    // 6️⃣ Send success response
    res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (err) {
    console.error("OTP VERIFICATION ERROR:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // 2️⃣ Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // 3️⃣ Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    // 4️⃣ Optional: clear old OTP data (good security practice)
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    // 5️⃣ Save user with new password
    await user.save();

    // 6️⃣ Send success response
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
