import React from "react";
import {
  ChevronLeft,
  Sparkles,
  Phone,
  Video,
  Info,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  X,
} from "lucide-react";

interface ChatHeaderProps {
  partner: any;
  isOnline: boolean;
  isTyping: boolean;
  onBack: () => void;
  onNavigate: (path: string) => void;
  selectedCount: number;
  canEdit: boolean;
  canDelete: boolean;
  isDeletingMessage: boolean;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  partner,
  isOnline,
  isTyping,
  onBack,
  onNavigate,
  selectedCount,
  canEdit,
  canDelete,
  isDeletingMessage,
  onEditSelected,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (!partner) return null;

  const isSelectionMode = selectedCount > 0;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 sticky top-0 z-20 transition-colors duration-300 ${
        isSelectionMode
          ? "bg-blue-50/90 backdrop-blur-2xl"
          : "bg-white/80 backdrop-blur-xl"
      }`}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 md:gap-4 transition-all">
        {isSelectionMode ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-200">
            <button
              onClick={onClearSelection}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all active:scale-90"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-lg leading-none">
                {selectedCount}
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Selected
              </span>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onBack}
              className="md:hidden p-2 -ml-1 text-slate-500 hover:text-blue-600 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            <div
              className="relative cursor-pointer group flex-shrink-0"
              onClick={() => onNavigate(`/profile?uId=${partner.uId}`)}
            >
              <img
                src={
                  partner.avatar ||
                  `https://picsum.photos/seed/${partner.uId}/100/100`
                }
                className="w-10 h-10 md:w-11 md:h-11 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-blue-100 transition-all shadow-sm"
                alt={partner.name}
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm ${
                  isOnline ? "bg-green-500" : "bg-slate-300"
                }`}
              />
            </div>

            <div className="min-w-0">
              <h4
                className="font-bold text-slate-900 leading-tight flex items-center gap-1.5 text-base md:text-lg cursor-pointer hover:text-blue-600 transition-colors truncate"
                onClick={() => onNavigate(`/profile?uId=${partner.uId}`)}
              >
                {partner.name}
                <Sparkles
                  size={14}
                  className="text-blue-500 fill-blue-500/10"
                />
              </h4>

              <div className="flex items-center gap-2 mt-0.5">
                {isTyping ? (
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest animate-pulse">
                    Typing...
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1 md:gap-2">
        {isSelectionMode ? (
          <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
            {canEdit && (
              <button
                onClick={onEditSelected}
                className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all active:scale-90"
                title="Edit"
              >
                <Pencil size={20} strokeWidth={2.5} />
              </button>
            )}

            {canDelete &&
              (isDeletingMessage ? (
                <div className="w-9 h-9 flex items-center justify-center">
                  <Loader2
                    size={18}
                    className="animate-spin text-red-500"
                    strokeWidth={2.5}
                  />
                </div>
              ) : (
                <button
                  onClick={onDeleteSelected}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                  title="Delete"
                >
                  <Trash2 size={20} strokeWidth={2.5} />
                </button>
              ))}
          </div>
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95">
                <Phone size={20} strokeWidth={2} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95">
                <Video size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
              <Info size={20} strokeWidth={2} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
              <MoreHorizontal size={20} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
