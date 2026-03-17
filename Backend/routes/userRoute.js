import express from "express";
import isAuth from "../middlewares/isAuth.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/currentuser", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Current user route error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
