import React, { useState, useEffect, useRef, useMemo } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import MobileNav from "../components/MobileNav";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";
import { chatService } from "../services/chatService";
import { authService } from "../services/authService";
import { useChatSocket } from "../sockets/chat/useChatSocket";
import { toast } from "sonner";
import { Chat, ChatMessage, User, SocketTypingPayload } from "../types";

const ChatPage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsPage, setChatsPage] = useState(1);
  const [hasMoreChats, setHasMoreChats] = useState(false);
  const [isFetchingMoreChats, setIsFetchingMoreChats] = useState(false);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isFetchingMoreMessages, setIsFetchingMoreMessages] = useState(false);

  const [inputText, setInputText] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Presence State
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = () => {
      authService.me().then(res => {
        setCurrentUser(res.data);
      }) 
      chatService.getChats(1, 15).then(res =>{
        setChats(res.chats ??[]);
      }).finally(() => {
        setIsLoading(false)
      }
      )
    }

    init();
  }, [])

  const { emitTyping } = useChatSocket({
    user: currentUser,
    selectedChatId: selectedChat?.id,
    setChats,
    setMessages,
    setOnlineUsers,
    setIsPartnerTyping,
    updateReadStatus: (id: string) =>
      chatService.updateMessageStatus(id, "READ"),
  });

  useEffect(() => {
    if (!selectedChat) return;

    setMessages([]);
    setMessagesPage(1);

    chatService.getMessages(selectedChat.id, 1, 30).then((res) => {
      setMessages(res.messages);
      setHasMoreMessages(res.pagination.hasNextPage);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "auto",
        });
      });
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingMoreChats(false);
    }
  };

  // Load more messages (history)
  const handleLoadMoreMessages = async () => {
    if (isFetchingMoreMessages || !hasMoreMessages || !selectedChat) return;
    setIsFetchingMoreMessages(true);
    const container = scrollRef.current;
    const oldHeight = container?.scrollHeight || 0;

    try {
      const nextPage = messagesPage + 1;
      const res = await chatService.getMessages(selectedChat.id, nextPage, 30);
      setMessages((prev) => [...res.messages, ...prev]);
      setMessagesPage(nextPage);
      setHasMoreMessages(res.pagination.hasNextPage);

      setTimeout(() => {
        if (container) container.scrollTop = container.scrollHeight - oldHeight;
      }, 0);
    } catch (err) {
      console.error(err);
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
          p.user?.name?.toLowerCase().includes(q)
      )
    );
  }, [chats, chatSearchQuery, currentUser?.id]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat || isSending) return;

    const text = inputText;
    setInputText("");
    setIsSending(true);

    emitTyping(selectedChat.id, false);

    try {
      await chatService.sendMessage(selectedChat.id, text);
    } catch {
      toast.error("Failed to send");
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

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  const selectedPartner = selectedChat?.participants.find(
    (p) => p.id !== currentUser?.id
  );
  const isSelectedPartnerOnline = selectedPartner
    ? onlineUsers.has(selectedPartner.id)
    : false;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-grow flex overflow-hidden">
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
        />

        <div
          className={`${
            !selectedChat ? "hidden md:flex" : "flex"
          } flex-grow flex-col bg-white relative h-full overflow-hidden shadow-2xl`}
        >
          {selectedChat ? (
            <>
              <ChatHeader
                partner={selectedPartner}
                isOnline={isSelectedPartnerOnline}
                isTyping={isPartnerTyping}
                onBack={() => setSelectedChat(null)}
                onNavigate={navigate}
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
              />
              <MessageInput
                text={inputText}
                isSending={isSending}
                onChange={handleInputUpdate}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
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
