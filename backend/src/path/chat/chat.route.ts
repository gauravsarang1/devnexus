import { chatController } from "./chat.controller.js";
import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
    createChatSchema,
    addParticipantSchema,
    removeParticipantSchema,
    deleteChatSchema,
    getAllChatsSchema,
    getChatByIdSchema,
} from "../../validation/chat/chat.validation.js";

const router = Router();

router.post("/", requireAuth, validate(createChatSchema), chatController.createChat);
router.get("/", requireAuth, validate(getAllChatsSchema), chatController.getAllChats);
router.get("/:id", requireAuth, validate(getChatByIdSchema), chatController.getChatById);
router.delete("/:id",requireAuth, validate(deleteChatSchema), chatController.deleteChat);

export default router;