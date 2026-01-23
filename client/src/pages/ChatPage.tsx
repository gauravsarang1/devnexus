import React, { useState, useEffect, useRef, useMemo, use } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import MobileNav from "../components/MobileNav";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";
import { chatService } from "../services/chatService";
import { useChatSocket } from "../sockets/chat/useChatSocket";
import { toast } from "sonner";
import {
  Chat,
  ChatMessage,
  User,
  SocketTypingPayload,
  MessageStatus,
} from "../types";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const ChatPage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsPage, setChatsPage] = useState(1);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hasMoreChats, setHasMoreChats] = useState(false);
  const [isFetchingMoreChats, setIsFetchingMoreChats] = useState(false);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isFetchingMoreMessages, setIsFetchingMoreMessages] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);

  const [inputText, setInputText] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [isDeleting, setIsDeleteting] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null,
  );
  const isSelectionMode = selectedMessages.length > 0;

  //Current User
  const user = useSelector((state: RootState) => state.auth.user);

  // Presence State
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const blockObserverRef = useRef(true);

  useEffect(() => {
    const init = () => {
      setCurrentUser(user ?? null);
      chatService
        .getChats(1, 15)
        .then((res) => {
          setChats(res.chats ?? []);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    init();
  }, []);

  const { emitTyping } = useChatSocket({
    user: currentUser,
    selectedChatId: selectedChat?.id,
    setChats,
    setMessages,
    setOnlineUsers,
    setIsPartnerTyping,
    updateReadStatus: (id: string, status: MessageStatus) =>
      updateMessageStatus(id, status),
  });

  const updateMessageStatus = async (id: string, status: MessageStatus) => {
    if (!id) return;
    await chatService.updateMessageStatus(id, status);
  };

  useEffect(() => {
    if (!selectedChat) return;

    setMessages([]);
    setMessagesPage(1);
    setHasMoreMessages(false);
    setInitialMessagesLoaded(false);
    setIsChatLoading(true);

    blockObserverRef.current = true;

    chatService
      .getMessages(selectedChat.id, 1, 30)
      .then((res) => {
        setMessages(res.messages);
        setHasMoreMessages(res.pagination.hasNextPage);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!scrollRef.current) return;

            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

            blockObserverRef.current = false;
            setInitialMessagesLoaded(true);
          });
        });
      })
      .finally(() => {
        setIsChatLoading(false);
      });

    chatService.markChatAsSeen(selectedChat.id);
  }, [selectedChat?.id]);

  // Load more chats (sidebar)
  const handleLoadMoreChats = async () => {
    if (isFetchingMoreChats || !hasMoreChats) return;
    setIsFetchingMoreChats(true);
    try {
      const nextPage = chatsPage + 1;
      const res = await chatService.getChats(nextPage, 15);
      setChats((prev) => [...(prev ?? []), ...(res?.chats ?? [])]);
      setChatsPage(nextPage);
      setHasMoreChats(res?.pagination?.hasNextPage ?? false);
    } finally {
      setIsFetchingMoreChats(false);
    }
  };

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return false;

    const threshold = 120; // px
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  useEffect(() => {
    if (
      !initialMessagesLoaded ||
      isFetchingMoreMessages || // 🚫 stop during history load
      blockObserverRef.current
    )
      return;

    if (isNearBottom()) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages.length]);

  // Load more messages (history)
  const handleLoadMoreMessages = async () => {
    if (
      blockObserverRef.current ||
      !initialMessagesLoaded || // 🚨 block early
      isFetchingMoreMessages ||
      !hasMoreMessages ||
      !selectedChat
    )
      return;

    setIsFetchingMoreMessages(true);

    const container = scrollRef.current;
    const oldHeight = container?.scrollHeight || 0;

    try {
      const nextPage = messagesPage + 1;
      const res = await chatService.getMessages(selectedChat.id, nextPage, 30);

      // 🚫 prevent auto-scroll side effects
      blockObserverRef.current = true;

      setMessages((prev) => [...res.messages, ...prev]);
      setMessagesPage(nextPage);
      setHasMoreMessages(res.pagination.hasNextPage);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - oldHeight;
        }

        // ✅ re-enable observer after correction
        blockObserverRef.current = false;
      });
    } finally {
      setIsFetchingMoreMessages(false);
    }
  };

  const filteredChats = useMemo(() => {
    if (!chatSearchQuery.trim()) return chats ?? [];
    const q = chatSearchQuery.toLowerCase();
    return chats.filter((c) =>
      c.participants?.some(
        (p) =>
          p.userId !== currentUser?.id &&
          p.user?.name?.toLowerCase().includes(q),
      ),
    );
  }, [chats, chatSearchQuery, currentUser?.id]);

  const handleSubmit = async () => {
    if (!inputText.trim() || !selectedChat || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    emitTyping(selectedChat.id, false);

    try {
      if (editingMessage) {
        await chatService.editMessage(editingMessage.id, text);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMessage.id ? { ...m, text, isEdited: true } : m,
          ),
        );

        setEditingMessage(null);
        setSelectedMessages([]);
      } else {
        await chatService.sendMessage(selectedChat.id, text);
      }
    } catch (err) {
      toast.error(editingMessage ? "Edit failed" : "Send failed");
      setInputText(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (selectedChat) {
      emitTyping(selectedChat.id, e.target.value.length > 0);
    }
  };

  const canEditSelectedMessage = useMemo(() => {
    if (selectedMessages.length !== 1) return false;

    const msg = selectedMessages[0];
    if (msg.senderId !== currentUser?.id) return false;

    const FIVE_MIN = 5 * 60 * 1000;
    return Date.now() - new Date(msg.createdAt).getTime() <= FIVE_MIN;
  }, [selectedMessages, currentUser]);

  const canDeleteSelectedMessages = useMemo(() => {
    if (!isSelectionMode) return false;

    return selectedMessages.every((m) => m.senderId === currentUser?.id);
  }, [selectedMessages, currentUser, isSelectionMode]);

  const handleSelectToggle = (msg: ChatMessage) => {
    setSelectedMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.id);
      if (exists) {
        return prev.filter((m) => m.id !== msg.id);
      }
      return [...prev, msg];
    });
  };

  const handleEditSelected = () => {
    if (!canEditSelectedMessage) return;

    const msg = selectedMessages[0];
    setEditingMessage(msg);
    setInputText(msg.text);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setSelectedMessages([]);
    setInputText("");
  };

  const handleDeleteSelected = async () => {
    if (!canDeleteSelectedMessages || selectedMessages.length === 0) return;

    const ids = selectedMessages.map((m) => m.id);

    setIsDeleteting(true);

    await Promise.all(ids.map((id) => chatService.deleteMessage(id))).then(() =>
      setIsDeleteting(false),
    );

    setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));

    setSelectedMessages([]);
    setEditingMessage(null);
  };

  const selectedPartner = selectedChat?.participants.find(
    (p) => p.id !== currentUser?.id,
  );
  const isSelectedPartnerOnline = selectedPartner
    ? onlineUsers.has(selectedPartner.id)
    : false;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <main className="grow flex overflow-hidden">
        <ChatSidebar
          chats={filteredChats}
          selectedChatId={selectedChat?.id}
          currentUser={currentUser}
          searchQuery={chatSearchQuery}
          onSearchChange={setChatSearchQuery}
          onSelectChat={setSelectedChat}
          onlineUsers={onlineUsers}
          onLoadMore={handleLoadMoreChats}
          hasMore={hasMoreChats}
          isFetchingMore={isFetchingMoreChats}
          isLoading={isLoading}
        />

        <div
          className={`${
            !selectedChat ? "hidden md:flex" : "flex"
          } grow flex-col bg-white relative h-full overflow-hidden shadow-2xl`}
        >
          {selectedChat ? (
            <>
              <ChatHeader
                partner={selectedPartner}
                isOnline={isSelectedPartnerOnline}
                isTyping={isPartnerTyping}
                onBack={() => setSelectedChat(null)}
                onNavigate={navigate}
                selectedCount={selectedMessages.length}
                canEdit={canEditSelectedMessage}
                canDelete={canDeleteSelectedMessages}
                onEditSelected={handleEditSelected}
                onDeleteSelected={handleDeleteSelected}
                onClearSelection={() => {
                  setSelectedMessages([]);
                  setEditingMessage(null);
                }}
                isDeletingMessage={isDeleting}
              />
              <MessageList
                messages={messages}
                currentUser={currentUser}
                partner={selectedPartner}
                isPartnerTyping={isPartnerTyping}
                scrollRef={scrollRef}
                hasMore={hasMoreMessages}
                isFetchingMore={isFetchingMoreMessages}
                onLoadMore={handleLoadMoreMessages}
                isLoading={isChatLoading}
                selectedMessages={selectedMessages}
                isSelectionMode={isSelectionMode}
                onSelectToggle={handleSelectToggle}
              />
              <MessageInput
                text={inputText}
                isSending={isSending}
                onChange={handleInputUpdate}
                onSubmit={handleSubmit}
                editingMessage={editingMessage}
                onCancelEdit={cancelEdit}
              />
            </>
          ) : (
            <div className="grow flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
              <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-blue-500/5 flex items-center justify-center mb-8 border border-slate-100">
                <MessageSquare size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Your Workspace
              </h2>
              <p className="text-slate-400 font-medium max-w-sm mt-3 leading-relaxed">
                Select a partner from the sidebar to coordinate your skill swap
                and start building together.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="mt-8 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
              >
                Find New Partners
              </button>
            </div>
          )}
        </div>
      </main>
      {!selectedChat && <MobileNav navigate={navigate} />}
    </div>
  );
};

export default ChatPage;
