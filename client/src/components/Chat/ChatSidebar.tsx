import React, { useCallback, useRef } from "react";
import {
  Search,
  MessageCircle,
  User as UserIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Chat, User } from "../../types";
import ChatSidebarSkeleton from "../skeleton/ChatSidebarSkeleton";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chat: Chat) => void;
  currentUser: User | null;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onlineUsers: Set<string>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  isLoading: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  currentUser,
  searchQuery,
  onSearchChange,
  onlineUsers,
  onLoadMore,
  hasMore,
  isFetchingMore,
  isLoading,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastChatRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (isFetchingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingMore, hasMore, onLoadMore]
  );

  const getPartner = (chat: any) =>
    chat.participants.find((p) => p.id !== currentUser?.id);

  if (isLoading) {
    return <ChatSidebarSkeleton />;
  }

  return (
    <div
      className={`${
        selectedChatId ? "hidden md:flex" : "flex"
      } w-full lg:w-95 flex-col border-r border-slate-100 bg-white`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Messages
            </h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-1">
              <Sparkles size={10} /> {chats.length} active sessions
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <MessageCircle size={20} />
          </div>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-blue-100 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grow overflow-y-auto px-2 pb-6 custom-scrollbar">
        {chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat, idx) => {
              const partner = getPartner(chat);
              const lastMsg = chat.messages[0];
              const isSelected = selectedChatId === chat.id;
              const isLast = idx === chats.length - 1;
              const isOnline = partner ? onlineUsers.has(partner.id) : false;

              return (
                <button
                  key={chat.id}
                  ref={isLast ? lastChatRef : null}
                  onClick={() => onSelectChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative group ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "hover:bg-slate-50 text-slate-900"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        partner?.avatar ||
                        `https://picsum.photos/seed/${partner?.uId}/100/100`
                      }
                      className={`w-14 h-14 rounded-2xl object-cover ring-2 transition-all ${
                        isSelected
                          ? "ring-white/30"
                          : "ring-transparent group-hover:ring-blue-100"
                      }`}
                      alt={partner?.name}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 rounded-full transition-colors ${
                        isOnline
                          ? isSelected
                            ? "bg-green-400 border-blue-600"
                            : "bg-green-500 border-white"
                          : "bg-slate-300 border-white"
                      }`}
                    ></div>
                  </div>
                  <div className="grow text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4
                        className={`font-bold truncate ${
                          isSelected ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {partner?.name}
                      </h4>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ml-2 ${
                          isSelected ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {chat.updatedAt
                          ? new Date(chat.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        isSelected
                          ? "text-blue-50"
                          : "text-slate-500 font-medium"
                      }`}
                    >
                      {lastMsg?.senderId === currentUser?.id ? "You: " : ""}
                      {lastMsg?.text || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}
            {isFetchingMore && (
              <div className="p-4 flex justify-center">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            )}
          </div>
        ) : (
          <div className="h-100 flex flex-col items-center justify-center opacity-40 px-8 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-4xl flex items-center justify-center mb-6">
              <UserIcon size={40} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              No Conversations
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-2">
              Start a swap to begin chatting with partners.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
