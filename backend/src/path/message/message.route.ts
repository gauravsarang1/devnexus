
import { messageController } from './message.controller.js';
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { MessageValidation } from '../../validation/message/message.validation.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, validate(MessageValidation.createMessage),  messageController.sendMessage);
router.get('/', messageController.getAllMessages)
router.get('/chat/:chatId', requireAuth,validate(MessageValidation.getMessagesByChatId),  messageController.getMessagesByChatId);
router.delete('/:messageId', requireAuth, validate(MessageValidation.deleteMessage), messageController.deleteMessage);
router.put('/:messageId', requireAuth, validate(MessageValidation.editMessage), messageController.editMessage);
router.post('/:messageId/seenBy',requireAuth, validate(MessageValidation.seenByMessage), messageController.seenBy);
router.post('/chat/:chatId/seen', requireAuth, validate(MessageValidation.markChatAsSeen), messageController.markChatAsSeen);
router.put('/:messageId/change-status', requireAuth, validate(MessageValidation.changeMessageStatus), messageController.changeMessageStatus)

export default router;
