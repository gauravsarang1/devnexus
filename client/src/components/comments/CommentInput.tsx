
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  replyTo?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({ 
  onSend, 
  placeholder = "Add a comment...", 
  autoFocus = false,
  replyTo
}) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content);
    setContent('');
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200">
      <img 
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
        alt="Me" 
        className="w-8 h-8 rounded-full border border-slate-200"
      />
      <input
        type="text"
        autoFocus={autoFocus}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder={replyTo ? `Replying to ${replyTo}...` : placeholder}
        className="flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none"
      />
      <button 
        onClick={handleSend}
        disabled={!content.trim()}
        className={`p-2 rounded-xl transition-all ${
          content.trim() 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 active:scale-90' 
            : 'text-slate-300'
        }`}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CommentInput;
