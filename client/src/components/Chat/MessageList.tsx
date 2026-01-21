import React, { useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Clock, Loader2, Calendar } from "lucide-react";
import { ChatMessage, User } from "../../types";

interface MessageListProps {
  messages: ChatMessage[];
  currentUser: User | null;
  partner: any;
  isPartnerTyping: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingMore?: boolean;
  isLoading: boolean;
  selectedMessages: ChatMessage[];
  isSelectionMode: boolean;
  onSelectToggle: (msg: ChatMessage) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  partner,
  isPartnerTyping,
  scrollRef,
  hasMore,
  onLoadMore,
  isFetchingMore,
  isLoading,
  selectedMessages,
  isSelectionMode,
  onSelectToggle,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const topRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && onLoadMore) {
            onLoadMore();
          }
        },
        { threshold: 0.1 },
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingMore, hasMore, onLoadMore],
  );

  const StatusIcon = ({ status }: { status?: string }) => {
    switch (status) {
      case "READ":
        return <CheckCheck size={12} className="text-blue-500" />;
      case "DELIVERED":
        return <CheckCheck size={12} className="text-slate-300" />;
      case "SENT":
        return <Check size={12} className="text-slate-300" />;
      default:
        return <Clock size={10} className="text-slate-300" />;
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const LONG_PRESS_DURATION = 450;

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const handlePointerDown = (msg: ChatMessage) => {
    longPressTriggered.current = false;

    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      onSelectToggle(msg);
    }, LONG_PRESS_DURATION);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = (msg: ChatMessage) => {
    if (isSelectionMode && !longPressTriggered.current) {
      onSelectToggle(msg);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msg: ChatMessage) => {
    e.preventDefault();
    onSelectToggle(msg);
  };

  if (isLoading) {
    return (
      <div
        ref={scrollRef}
        className="grow overflow-y-hidden px-4 py-8 md:px-12 space-y-6 pb-32 bg-white animate-pulse"
      >
        {/* Date divider */}
        <div className="flex justify-center my-8">
          <div className="h-6 w-24 bg-slate-100 rounded-full border border-slate-200" />
        </div>

        {/* Incoming message */}
        <div className="flex justify-start mt-6">
          <div className="w-10 mr-3">
            <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
          </div>
          <div className="max-w-[70%]">
            <div className="h-12 w-64 bg-slate-100 rounded-3xl rounded-bl-none border border-slate-200" />
            <div className="h-3 w-12 bg-slate-200 rounded mt-2" />
          </div>
        </div>

        {/* Incoming consecutive */}
        <div className="flex justify-start mt-2">
          <div className="w-10 mr-3" />
          <div className="max-w-[60%]">
            <div className="h-10 w-48 bg-slate-100 rounded-[20px] border border-slate-200" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end mt-6">
          <div className="max-w-[65%] flex flex-col items-end">
            <div className="h-12 w-56 bg-blue-500/80 rounded-3xl rounded-br-none" />
            <div className="h-3 w-10 bg-slate-200 rounded mt-2" />
          </div>
        </div>

        {/* Outgoing consecutive */}
        <div className="flex justify-end mt-2">
          <div className="max-w-[50%]">
            <div className="h-10 w-40 bg-blue-500/70 rounded-[20px]" />
          </div>
        </div>

        {/* Another date divider */}
        <div className="flex justify-center my-8">
          <div className="h-6 w-32 bg-slate-100 rounded-full border border-slate-200" />
        </div>

        {/* Mixed messages */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex ${
              i % 2 === 0 ? "justify-end" : "justify-start"
            } mt-6`}
          >
            {i % 2 !== 0 && (
              <div className="w-10 mr-3">
                <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
              </div>
            )}
            <div className="max-w-[70%]">
              <div
                className={`h-11 ${
                  i % 2 === 0 ? "w-52 bg-blue-500/70" : "w-60 bg-slate-100"
                } rounded-3xl border border-slate-200`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="grow overflow-y-auto overflow-x-hidden py-6 space-y-1 scroll-smooth pb-32 custom-scrollbar bg-white"
    >
      <div ref={topRef} className="h-4 flex items-center justify-center mb-6">
        {isFetchingMore && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <Loader2 className="animate-spin text-blue-600" size={14} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Loading History
            </span>
          </div>
        )}
      </div>

      {messages.map((msg, idx) => {
        const isMe = msg.senderId === currentUser?.id;
        const prevMsg = messages[idx - 1];
        const isNewDay =
          !prevMsg ||
          new Date(prevMsg.createdAt).toDateString() !==
            new Date(msg.createdAt).toDateString();
        const isConsecutive =
          prevMsg && prevMsg.senderId === msg.senderId && !isNewDay;
        const isSelected = selectedMessages.some((m) => m.id === msg.id);

        return (
          <React.Fragment key={msg.id}>
            {isNewDay && (
              <div className="flex justify-center my-8 px-4">
                <div className="px-4 py-1 bg-slate-100/50 rounded-lg border border-slate-200/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              </div>
            )}

            <div
              onPointerDown={() => handlePointerDown(msg)}
              onPointerUp={clearLongPress}
              onPointerLeave={clearLongPress}
              onClick={() => handleClick(msg)}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative w-full group transition-all duration-300 flex flex-col ${
                isSelected ? "bg-blue-600/5" : "hover:bg-slate-50/50"
              } ${isConsecutive ? "mt-0.5" : "mt-4"}`}
            >
              {/* SELECTION INDICATOR LINE */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 z-10"
                  />
                )}
              </AnimatePresence>

              <div
                className={`flex w-full px-4 md:px-12 items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className="w-8 md:w-10 shrink-0">
                  {!isMe && !isConsecutive && (
                    <img
                      src={
                        partner?.avatar ||
                        `https://picsum.photos/seed/${partner?.uId}/100/100`
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover shadow-sm ring-2 ring-blue-50"
                      alt="avatar"
                    />
                  )}
                </div>

                {/* Bubble Container */}
                <div
                  className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`relative px-4 py-2.5 shadow-sm transition-transform active:scale-[0.98] ${
                      isMe
                        ? `bg-blue-600 text-white ${isConsecutive ? "rounded-2xl" : "rounded-2xl rounded-br-none"}`
                        : `bg-slate-100 text-slate-800 ${isConsecutive ? "rounded-2xl" : "rounded-2xl rounded-bl-none"}`
                    }`}
                  >
                    <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div
                    className={`flex items-center gap-1.5 mt-1 px-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <StatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {isPartnerTyping && (
        <div className="flex items-center gap-3 px-4 md:px-12 mt-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((d) => (
                <motion.div
                  key={d}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: d }}
                  className="w-1 h-1 bg-blue-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
