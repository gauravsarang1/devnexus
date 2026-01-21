import { ChatMessage, MessageStatus, User } from "@/src/types";

export const updateMessageStatus = (
    messages: ChatMessage[],
    messageId: string,
    status: MessageStatus
) =>
    messages.map(m =>
        m.id === messageId ? { ...m, status } : m
    );

export const markChatAsRead = (
    messages: ChatMessage[],
    chatId: string,
    currentUserId: string
) =>
    messages.map(m =>
        m.chatId === chatId && m.senderId !== currentUserId
            ? { ...m, status: 'READ' }
            : m
    );

export const editMessage = (
    messages: ChatMessage[],
    updatedMessage: ChatMessage,
) => 
    messages.map(m =>
        m.id === updatedMessage.id
            ? { ...m, text: updatedMessage.text}
            :m
    );


export const deleteMessage = (
    messages: ChatMessage[],
    messageId: string
) => 
    messages.filter(m => m.id !== messageId);