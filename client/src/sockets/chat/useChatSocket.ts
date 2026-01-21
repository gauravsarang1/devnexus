import { useEffect, useMemo } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../socketEvents";
import { handleIncomingMessage, handleTyping } from "./chatSocketHandlers";
import { debounce } from "@/src/utils/debounce";
import { MessageStatus } from "@/src/types";
import {
  updateMessageStatus,
  markChatAsRead,
  editMessage,
  deleteMessage
} from "./chatMessageUpdaters";

export const useChatSocket = ({
  user,
  selectedChatId,
  setChats,
  setMessages,
  setOnlineUsers,
  setIsPartnerTyping,
  updateReadStatus,
}: any) => {

  useEffect(() => {
    if (!user) return;

    const onOnline = ({ userId }: any) =>
      setOnlineUsers((p: Set<string>) => new Set(p).add(userId));

    const onOffline = ({ userId }: any) =>
      setOnlineUsers((p: Set<string>) => {
        const n = new Set(p);
        n.delete(userId);
        return n;
      });

    const onMessage = (msg: any) =>
      handleIncomingMessage(msg, {
        setChats,
        setMessages,
        selectedChatId,
        currentUserId: user.id,
        updateReadStatus,
        stopTyping: () => setIsPartnerTyping(false),
      });

    const onTyping = (data: any) =>
      handleTyping(data, selectedChatId, setIsPartnerTyping);

    const onStatusChange = ({
      messageId,
      status,
    }: {
      messageId: string;
      status: MessageStatus;
    }) => {
      setMessages((prev: any[]) =>
        updateMessageStatus(prev, messageId, status)
      );
    };

    const onSeen = ({ chatId, userId}: { chatId: string; userId: string}) => {
      setMessages((prev: any[]) =>
        markChatAsRead(prev, chatId, userId)
      );
    };

    const onEdit = (msg: any) => {
      if(msg.senderId === user.id) return;
      setMessages((prev: any[]) => 
        editMessage(prev, msg)
      );
    };

    const onDelete = (data: {messageId: string, userId: string}) => {
      if(data.userId === user.id) return;
      setMessages((prev: any[]) => 
        deleteMessage(prev, data.messageId)
      );
    };

    socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, onOnline);
    socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, onOffline);
    socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessage);
    socket.on(SOCKET_EVENTS.TYPING, onTyping);
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS, onStatusChange);
    socket.on(SOCKET_EVENTS.CHAT_SEEN, onSeen);
    socket.on(SOCKET_EVENTS.MESSAGE_EDIT, onEdit);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETE, onDelete);

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_ONLINE, onOnline);
      socket.off(SOCKET_EVENTS.PRESENCE_OFFLINE, onOffline);
      socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessage);
      socket.off(SOCKET_EVENTS.TYPING, onTyping);
      socket.off(SOCKET_EVENTS.MESSAGE_STATUS, onStatusChange);
      socket.off(SOCKET_EVENTS.CHAT_SEEN, onSeen);
      socket.off(SOCKET_EVENTS.MESSAGE_EDIT, onEdit);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETE, onDelete);
    };
  }, [user, selectedChatId]);

  // --- rooms ---
  useEffect(() => {
  if (!selectedChatId) return;

  socket.emit("join:chat", { chatId: selectedChatId });

  return () => {
    socket.emit("leave:chat", { chatId: selectedChatId });
  };
}, [selectedChatId]);


  // --- typing ---
  const emitTyping = useMemo(
    () =>
      debounce((chatId: string, isTyping: boolean) => {
        socket.emit("chat:typing", { chatId, isTyping });
      }, 300),
    []
  );

  return { emitTyping };
};
