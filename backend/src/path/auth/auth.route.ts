
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerSchema, loginSchema, verifyEmailOtpSchema } from "../../validation/auth/auth.validation.js";
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// ------------------ Auth Routes ------------------
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);
router.get("/check-availability", authController.checkAvailability);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/verify-email-otp", validate(verifyEmailOtpSchema), authController.verifyEmailOtp);
router.delete("/delete", requireAuth, authController.delete)

export default router;
