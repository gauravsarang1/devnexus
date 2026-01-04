
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { Chat, ChatMessage, User, SocketTypingPayload } from '../src/types';

const ChatPage: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsPage, setChatsPage] = useState(1);
  const [hasMoreChats, setHasMoreChats] = useState(false);
  const [isFetchingMoreChats, setIsFetchingMoreChats] = useState(false);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isFetchingMoreMessages, setIsFetchingMoreMessages] = useState(false);

  const [inputText, setInputText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  
  // Presence State
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await authService.me();
        if (meRes.success && meRes.data) {
          setCurrentUser(meRes.data);
          const chatsRes = await chatService.getChats(1, 15);
          setChats(chatsRes?.chats ?? []);
          setHasMoreChats(chatsRes?.pagination?.hasNextPage ?? false);

          socketRef.current = io(import.meta.env.VITE_API_URL, { transports: ['websocket'] });
          
          socketRef.current.on('connect', () => {
            socketRef.current?.emit('hello', { id: meRes.data.id, name: meRes.data.name });
            socketRef.current?.emit('request:presence');
          });
          
          socketRef.current.on('presence:online', ({ userId }) => {
            setOnlineUsers(prev => new Set([...Array.from(prev), userId]));
          });

          socketRef.current.on('presence:offline', ({ userId }) => {
            setOnlineUsers(prev => {
              const next = new Set(prev);
              next.delete(userId);
              return next;
            });
          });

          socketRef.current.on('message:send', (msg: ChatMessage) => {
            setChats(prev => {
              const prevArr = prev ?? [];
              const existing = prevArr.find(c => c.id === msg.chatId);
              if (existing) {
                return prevArr.map(c => 
                  c.id === msg.chatId ? { ...c, messages: [msg], updatedAt: new Date().toISOString() } : c
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
              }
              return prevArr;
            });
            
            if (selectedChat?.id === msg.chatId) {
              setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
              if (msg.senderId !== meRes.data.id) chatService.updateMessageStatus(msg.id, 'READ');
              setIsPartnerTyping(false);
            }
          });

          socketRef.current.on('chat:typing', (data: SocketTypingPayload) => {
            if (selectedChat?.id === data.chatId) setIsPartnerTyping(data.isTyping);
          });
        }
      } catch (err) { 
        toast.error("Failed to load conversations"); 
      } finally { 
        setIsLoading(false); 
      }
    };
    init();
    return () => { socketRef.current?.disconnect(); };
  }, [selectedChat?.id]);

  // Load more chats (sidebar)
  const handleLoadMoreChats = async () => {
    if (isFetchingMoreChats || !hasMoreChats) return;
    setIsFetchingMoreChats(true);
    try {
      const nextPage = chatsPage + 1;
      const res = await chatService.getChats(nextPage, 15);
      setChats(prev => [...(prev ?? []), ...(res?.chats ?? [])]);
      setChatsPage(nextPage);
      setHasMoreChats(res?.pagination?.hasNextPage ?? false);
    } catch (err) { console.error(err); } 
    finally { setIsFetchingMoreChats(false); }
  };

  // Select Chat / Load Initial Messages
  useEffect(() => {
    if (selectedChat) {
      setMessages([]);
      setMessagesPage(1);
      socketRef.current?.emit('join:chat', { chatId: selectedChat.id });
      chatService.getMessages(selectedChat.id, 1, 30).then(res => {
        setMessages(res.messages);
        setHasMoreMessages(res.pagination.hasNextPage);
        setTimeout(() => {
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
      });
      chatService.markChatAsSeen(selectedChat.id);
    }
  }, [selectedChat?.id]);

  // Load more messages (history)
  const handleLoadMoreMessages = async () => {
    if (isFetchingMoreMessages || !hasMoreMessages || !selectedChat) return;
    setIsFetchingMoreMessages(true);
    const container = scrollRef.current;
    const oldHeight = container?.scrollHeight || 0;

    try {
      const nextPage = messagesPage + 1;
      const res = await chatService.getMessages(selectedChat.id, nextPage, 30);
      setMessages(prev => [...res.messages, ...prev]);
      setMessagesPage(nextPage);
      setHasMoreMessages(res.pagination.hasNextPage);

      setTimeout(() => {
        if (container) container.scrollTop = container.scrollHeight - oldHeight;
      }, 0);
    } catch (err) { console.error(err); } 
    finally { setIsFetchingMoreMessages(false); }
  };

  const filteredChats = useMemo(() => {
    if (!chatSearchQuery.trim()) return chats ?? [];
    const q = chatSearchQuery.toLowerCase();
    return chats.filter(c => c.participants.find(p => p.userId !== currentUser?.id)?.user.name.toLowerCase().includes(q));
  }, [chats, chatSearchQuery, currentUser?.id]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChat || isSending) return;
    const text = inputText; 
    setInputText(''); 
    setIsSending(true);
    socketRef.current?.emit('chat:typing', { chatId: selectedChat.id, isTyping: false });
    try { 
      await chatService.sendMessage(selectedChat.id, text); 
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } catch (err) { 
      toast.error("Failed to send"); 
      setInputText(text); 
    } finally { 
      setIsSending(false); 
    }
  };

  const handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (selectedChat) {
      socketRef.current?.emit('chat:typing', { chatId: selectedChat.id, isTyping: e.target.value.length > 0 });
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const selectedPartner = selectedChat?.participants.find(p => p.id !== currentUser?.id);
  const isSelectedPartnerOnline = selectedPartner ? onlineUsers.has(selectedPartner.id) : false;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="hidden md:flex">
        <Navbar navigate={navigate}/>
      </div>
      <main className="flex-grow Md:pt-[72px] md:pt-[88px] flex overflow-hidden">
        <ChatSidebar 
          chats={filteredChats} selectedChatId={selectedChat?.id} currentUser={currentUser}
          searchQuery={chatSearchQuery} onSearchChange={setChatSearchQuery}
          onSelectChat={setSelectedChat} onlineUsers={onlineUsers}
          onLoadMore={handleLoadMoreChats} hasMore={hasMoreChats} isFetchingMore={isFetchingMoreChats}
        />
        
        <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-grow flex-col bg-white relative h-full overflow-hidden shadow-2xl`}>
          {selectedChat ? (
            <>
              <ChatHeader 
                partner={selectedPartner} 
                isOnline={isSelectedPartnerOnline}
                isTyping={isPartnerTyping} onBack={() => setSelectedChat(null)} onNavigate={navigate} 
              />
              <MessageList
                messages={messages} currentUser={currentUser} 
                partner={selectedPartner}
                isPartnerTyping={isPartnerTyping} scrollRef={scrollRef} 
                hasMore={hasMoreMessages} isFetchingMore={isFetchingMoreMessages} onLoadMore={handleLoadMoreMessages}
              />
              <MessageInput text={inputText} isSending={isSending} onChange={handleInputUpdate} onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
              <div className="w-24 h-24 bg-white rounded-[40px] shadow-xl shadow-blue-500/5 flex items-center justify-center mb-8 border border-slate-100">
                <MessageSquare size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Workspace</h2>
              <p className="text-slate-400 font-medium max-w-sm mt-3 leading-relaxed">
                Select a partner from the sidebar to coordinate your skill swap and start building together.
              </p>
              <button onClick={() => navigate('/search')} className="mt-8 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
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
