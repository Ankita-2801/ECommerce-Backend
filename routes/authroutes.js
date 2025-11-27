import express from 'express';
import passport from 'passport';
import { loginValidation, signupValidation } from '../middleware/authMiddleware.js';
import  { signup,login, forgotPassword, resetPassword,verifyOtp, googleCallback } from '../controllers/authController.js';
 const router = express.Router();

router.post('/auth/signup',signupValidation,signup)
router.post('/auth/login',loginValidation,login)
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/reset-password', resetPassword);
router.get("/auth/google-login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: handle callback from Google
router.get(
  "/auth/google",
  passport.authenticate("google", { failureRedirect: `${process.env.cors_origin}/login?error=GoogleAuthFailed` }),
  googleCallback
);

export default router;

