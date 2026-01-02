
import { messageController } from './message.controller.js';
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { MessageValidation } from '../../validation/message/message.validation.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// Create a new message
router.post('/', requireAuth, validate(MessageValidation.createMessage),  messageController.sendMessage);

//get All messages
router.get('/', messageController.getAllMessages)

// Get messages for a chat with pagination
router.get('/chat/:chatId', validate(MessageValidation.getMessagesByChatId),  messageController.getMessagesByChatId);

// Delete a message by ID
router.delete('/:messageId', requireAuth, validate(MessageValidation.deleteMessage), messageController.deleteMessage);

// Edit a message by ID
router.put('/:messageId', requireAuth, validate(MessageValidation.editMessage), messageController.editMessage);

// seenBy
router.post('/:messageId/seenBy',requireAuth, validate(MessageValidation.seenByMessage), messageController.seenBy);

// mark whole chat as seen
router.post('/chat/:chatId/seen', requireAuth, messageController.markChatAsSeen);

//status
router.put('/:messageId/change-status', requireAuth, validate(MessageValidation.changeMessageStatus), messageController.changeMessageStatus)

export default router;
