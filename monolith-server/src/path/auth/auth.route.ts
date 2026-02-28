
import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { AuthValidation } from "./auth.validation.js";
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// ------------------ Auth Routes ------------------
router.post("/register", validate(AuthValidation.registerSchema), authController.register);
router.post("/login", validate(AuthValidation.loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/verify-email-otp", validate(AuthValidation.verifyEmailOtpSchema), authController.verifyEmailOtp);
router.delete("/delete", requireAuth, authController.delete);

router.get("/request-forget-password-otp/:emailORuId", validate(AuthValidation.requestForgetPassword), authController.requestForgetPassword);
router.post("/verify-forget-password-otp/:emailORuId", validate(AuthValidation.forgetPasswordWithOTP), authController.forgetPasswordWithOTP);

export default router;
