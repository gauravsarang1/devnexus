
import React, { useState } from 'react';
import { Paperclip, Loader2, Send, Plus, Smile, Image as ImageIcon, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../../services/aiService';
import { toast } from 'sonner';

interface MessageInputProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ text, onChange, onSend, isSending }) => {
  const [showTools, setShowTools] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!text.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const res = await aiService.refineMessage(text);
      if (res.success) {
        // Create a synthetic event for the onChange handler
        const event = { target: { value: res.data.refined } } as React.ChangeEvent<HTMLInputElement>;
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
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="flex items-end gap-3 bg-white border border-slate-200/60 rounded-[32px] p-2 pr-2.5 shadow-2xl shadow-blue-500/10 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/5">
          
          <div className="flex items-center gap-1 pl-2 mb-1">
            <button 
              onClick={() => setShowTools(!showTools)}
              className={`p-2.5 rounded-full transition-all ${
                showTools ? 'bg-blue-600 text-white rotate-45' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={handleRefine}
              disabled={!text.trim() || isRefining}
              className={`p-2.5 rounded-full transition-all ${isRefining ? 'text-blue-600 animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
              title="Refine with AI"
            >
              <Sparkles size={20} />
            </button>
          </div>

          <div className="flex-grow pb-1">
            <input 
              type="text" 
              value={text} 
              onChange={onChange} 
              onKeyDown={(e) => e.key === 'Enter' && onSend()} 
              placeholder="Type a message..." 
              className="w-full bg-transparent border-none py-3 text-sm md:text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium" 
            />
          </div>

          <div className="flex items-center gap-2 mb-1">
            {!text.trim() && (
              <>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all hidden sm:flex">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                  <Mic size={20} />
                </button>
              </>
            )}
            
            <button 
              onClick={onSend} 
              disabled={!text.trim() || isSending}
              className={`p-3 rounded-[20px] transition-all active:scale-95 ${
                text.trim() 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5' 
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showTools && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-28 left-6 md:left-12 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-3 flex gap-2 z-50"
            >
              {[
                { icon: <ImageIcon size={20} />, label: 'Image', color: 'bg-green-50 text-green-600' },
                { icon: <Paperclip size={20} />, label: 'File', color: 'bg-blue-50 text-blue-600' },
                { icon: <Plus size={20} />, label: 'Project', color: 'bg-purple-50 text-purple-600' }
              ].map(tool => (
                <button key={tool.label} className="flex flex-col items-center gap-1.5 p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tool.label}</span>
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
