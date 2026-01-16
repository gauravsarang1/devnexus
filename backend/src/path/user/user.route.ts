
import { userController } from "./user.controller.js";
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserValidation } from "../../validation/user/user.validation.js";

const router = Router();

router.get("/",requireAuth, validate(UserValidation.getAllUsers), userController.getAllUsers);
router.get("/current", requireAuth, userController.current);
router.get("/activity", requireAuth, userController.getActivity);
router.get("/suggestions", requireAuth, userController.getSuggestions);
router.get("/mutual-skills/:otherUserId", requireAuth, validate(UserValidation.getMutualSkills), userController.getMutualSkills);
router.get("/:userIdORuId", requireAuth, validate(UserValidation.getUserById), userController.getUserById);

router.post("/push-subscribe", requireAuth, validate(UserValidation.userSubscription), userController.saveSubscription);
router.get("/remove-subscribe", requireAuth, validate(UserValidation.userSubscription), userController.removePushSubscription);
router.put("/update-profile", requireAuth, validate(UserValidation.updateProfile), userController.updateProfile);
router.put("/change-password", requireAuth, validate(UserValidation.changePassword), userController.updatePassword);
router.delete("/delete-account", requireAuth, userController.deleteAccount);

export default router;
