
import { Router } from "express";
import { notificationController } from "./notification.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, notificationController.getAll);
router.get("/unread-count", requireAuth, notificationController.getUnreadCount);
router.put("/mark-all-read", requireAuth, notificationController.markAllRead);
router.put("/:id/mark-read", requireAuth, notificationController.markRead);

export default router;
