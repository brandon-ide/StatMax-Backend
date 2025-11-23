import express from 'express';
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { signup, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);

router.post("/request-password-reset", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(200).json({ message: "If that email exists, a reset link was sent." });
  
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 1000 * 60 * 10;
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expires;
      await user.save();
  
      const resetURL = `http://localhost:5173/reset-password/${token}`;
  
      await sendEmail({
        to: user.email,
        subject: "Reset Your StatMax Password",
        text: `Click here to reset your password: ${resetURL}`,
      });
  
      res.json({ message: "Reset email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Token invalid or expired." });
      }
  
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({ message: "Password updated successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

export default router;
