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

// Create a new chat
router.post("/", requireAuth, validate(createChatSchema), chatController.createChat);

// Get all chats
router.get("/", validate(getAllChatsSchema), chatController.getAllChats);

// Get a chat by ID
router.get("/:id", requireAuth, validate(getChatByIdSchema), chatController.getChatById);

// Delete a chat by ID
router.delete("/:id",requireAuth, validate(deleteChatSchema), chatController.deleteChat);

// Add a participant to a chat
router.post("/add-participant", validate(addParticipantSchema), chatController.addParticipant);

// Remove a participant from a chat
router.post("/remove-participant", validate(removeParticipantSchema), chatController.removeParticipant);

// Additional chat-related routes can be added here

export default router;