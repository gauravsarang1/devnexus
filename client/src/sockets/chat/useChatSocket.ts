import { useEffect, useMemo } from "react";
import socket from "../socket";
import { SOCKET_EVENTS } from "../socketEvents";
import { handleIncomingMessage, handleTyping } from "./chatSocketHandlers";
import { debounce } from "@/src/utils/debounce";

export const useChatSocket = ({
  user,
  selectedChatId,
  setChats,
  setMessages,
  setOnlineUsers,
  setIsPartnerTyping,
  updateReadStatus,
}: any) => {

  // --- listeners ---
  useEffect(() => {
    if (!user) return;

    const onOnline = ({ userId }: any) => {
      setOnlineUsers((prev: Set<string>) => new Set(prev).add(userId));
    };

    const onOffline = ({ userId }: any) => {
      setOnlineUsers((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

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

    socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, onOnline);
    socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, onOffline);
    socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessage);
    socket.on(SOCKET_EVENTS.TYPING, onTyping);

    return () => {
      socket.off(SOCKET_EVENTS.PRESENCE_ONLINE, onOnline);
      socket.off(SOCKET_EVENTS.PRESENCE_OFFLINE, onOffline);
      socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessage);
      socket.off(SOCKET_EVENTS.TYPING, onTyping);
    };
  }, [user, selectedChatId]);

  // --- join / leave chat rooms ---
  useEffect(() => {
    if (!selectedChatId) return;

    socket.emit("join:chat", { chatId: selectedChatId });

    return () => {
      socket.emit("leave:chat", { chatId: selectedChatId });
    };
  }, [selectedChatId]);

  // --- debounced typing ---
  const emitTyping = useMemo(
    () =>
      debounce((chatId: string, isTyping: boolean) => {
        socket.emit("chat:typing", { chatId, isTyping });
      }, 300),
    []
  );

  return { emitTyping };
};
