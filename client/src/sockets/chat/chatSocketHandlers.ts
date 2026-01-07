import { ChatMessage, SocketTypingPayload } from '../../types';

export const handleIncomingMessage = (
    msg: ChatMessage,
    {
        setChats,
        setMessages,
        selectedChatId,
        currentUserId,
        updateReadStatus,
        stopTyping,
    }: any
) => {
    setChats((prev: any[]) =>
        prev
            .map(c =>
                c.id === msg.chatId
                    ? { ...c, messages: [msg], updatedAt: new Date().toISOString() }
                    : c
            )
            .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    );

    if (selectedChatId === msg.chatId) {
        setMessages((prev: ChatMessage[]) =>
            prev.find(m => m.id === msg.id) ? prev : [...prev, msg]
        );

        if (msg.senderId !== currentUserId) {
            updateReadStatus(msg.id);
        }

        stopTyping();
    }
};

export const handleTyping = (
    data: SocketTypingPayload,
    selectedChatId: string | null,
    setIsTyping: (v: boolean) => void
) => {
    if (data.chatId === selectedChatId) {
        setIsTyping(data.isTyping);
    }
};
