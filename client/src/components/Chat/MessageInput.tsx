import React, { useState } from "react";
import {
  Paperclip,
  Loader2,
  Send,
  Plus,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Check,
  X,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiService } from "../../services/aiService";
import { toast } from "sonner";
import { ChatMessage } from "../../types";

interface MessageInputProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isSending: boolean;
  editingMessage?: ChatMessage | null;
  onCancelEdit?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  text,
  onChange,
  onSubmit,
  isSending,
  editingMessage,
  onCancelEdit,
}) => {
  const [showTools, setShowTools] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!text.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const res = await aiService.refineMessage(text);
      if (res.success) {
        const event = {
          target: { value: res.data.refined },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
        toast.success("Message optimized! ✨");
      }
    } catch (err) {
      toast.error("Refinement failed.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto relative">
        
        {/* EDITING INDICATOR SHELF */}
        <AnimatePresence>
          {editingMessage && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute -top-14 left-4 right-4 bg-white/80 backdrop-blur-md border border-blue-100 border-b-0 rounded-t-2xl px-4 py-2 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex-shrink-0 w-1 h-8 bg-blue-500 rounded-full" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Editing Message</span>
                  <p className="text-xs text-slate-500 truncate italic">"{editingMessage.text}"</p>
                </div>
              </div>
              <button 
                onClick={onCancelEdit}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN INPUT CONTAINER */}
        <div className={`relative flex items-end gap-2 bg-white border border-slate-200/60 p-2 pr-2.5 shadow-2xl shadow-blue-500/10 transition-all duration-300 ${
          editingMessage ? 'rounded-b-3xl rounded-t-none border-blue-200' : 'rounded-[32px] focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/5'
        }`}>
          
          <div className="flex items-center gap-0.5 pl-1 mb-1">
            {!editingMessage && (
              <>
                <button
                  onClick={() => setShowTools(!showTools)}
                  className={`p-2.5 rounded-full transition-all ${
                    showTools
                      ? "bg-blue-600 text-white rotate-45 shadow-lg shadow-blue-500/40"
                      : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={handleRefine}
                  disabled={!text.trim() || isRefining}
                  className={`p-2.5 rounded-full transition-all ${
                    isRefining ? "text-blue-600 animate-pulse" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                  }`}
                  title="Refine with AI"
                >
                  <Sparkles size={20} />
                </button>
              </>
            )}
            {editingMessage && (
               <div className="p-2.5 text-blue-500 bg-blue-50 rounded-full ml-1">
                  <Edit2 size={18} />
               </div>
            )}
          </div>

          <div className="flex-grow pb-1 px-2">
            <input
              type="text"
              value={text}
              onChange={onChange}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder={editingMessage ? "Update your message..." : "Type a message..."}
              className="w-full bg-transparent border-none py-3 text-sm md:text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            {/* Action Buttons: Only show when NOT editing and text is empty */}
            {!editingMessage && !text.trim() && (
              <div className="flex items-center gap-0.5 animate-in fade-in duration-300">
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all hidden sm:flex">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                  <Mic size={20} />
                </button>
              </div>
            )}

            <button
              onClick={onSubmit}
              disabled={!text.trim() || isSending}
              className={`p-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center min-w-[48px] ${
                text.trim()
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5"
                  : "bg-slate-100 text-slate-300"
              }`}
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : editingMessage ? (
                <Check size={22} strokeWidth={3} />
              ) : (
                <Send size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* TOOLS MENU */}
        <AnimatePresence>
          {showTools && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-xl rounded-[28px] shadow-2xl border border-slate-100 p-2 flex gap-1 z-50 ring-1 ring-black/5"
            >
              {[
                { icon: <ImageIcon size={20} />, label: "Image", color: "bg-emerald-50 text-emerald-600" },
                { icon: <Paperclip size={20} />, label: "File", color: "bg-blue-50 text-blue-600" },
                { icon: <Plus size={20} />, label: "Project", color: "bg-violet-50 text-violet-600" },
              ].map((tool) => (
                <button
                  key={tool.label}
                  className="flex flex-col items-center gap-1 p-3 hover:bg-slate-50 rounded-[20px] transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {tool.label}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageInput;