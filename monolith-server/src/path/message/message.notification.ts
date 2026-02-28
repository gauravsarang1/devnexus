import { Message } from "@prisma/client";
import { NotificationService } from "../notification/notification.service.js";
import io from "../../sockets/socketHandlers.js";
import { PushService } from "../../services/pushService.js";

interface MessageWithUser extends Message {
    user: {
        name: string
    }
}

interface MessageWithPayload extends Message {
    sender: {
        name: string,
        avatar: string,
        uId: string
    }
}

export class MessageNotifier {
    static sendMessage(data: {
        chatId: string,
        reciverId: string,
        message: MessageWithUser,
        socketPayload: MessageWithPayload
    }) {
        const { chatId, reciverId, message, socketPayload } = data;

        io.to(chatId).emit('message:send', socketPayload);

        NotificationService.createNotification({
            userId: reciverId,
            type: 'CHAT',
            title: `Message from ${message.user.name}`,
            message: message.text,
            link: '/chat',
            payload: { chatId }
        });

        io.to(`user:${reciverId}`).emit('notification', {
            type: 'CHAT',
            title: `Message from ${message.user.name}`,
            message: message.text,
            link: '/chat',
            payload: { chatId }
        });

        PushService.sendNotification(reciverId, {
            title: `New Message from ${message.user.name} 💬`,
            message: message.text,
            link: '/chat'
        });
    }
}