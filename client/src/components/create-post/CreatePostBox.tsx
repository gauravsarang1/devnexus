import React, { useState } from 'react';
import { Send, Image as ImageIcon, MapPin } from 'lucide-react';
import { Mention, Post } from '../../types';
import MentionPicker from './MentionPicker';
import MentionChip from './MentionChip';
import { postService } from '../../services/postService';

interface CreatePostBoxProps {
  onPostCreated?: (post: Post) => void;
}

const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isPending) return;

    setIsPending(true);
    try {
      const newPost = await postService.createPost({
        content,
        mentionsOnPost: mentions.map((m) =>
          m.type === 'user'
            ? { userId: m.id }
            : { projectId: m.id }
        ),
      });

      console.log("mentions", mentions)
      console.log("newPost", newPost)

      onPostCreated?.(newPost);

      setContent('');
      setMentions([]);
    } catch (error) {
      console.error('Failed to create post', error);
    } finally {
      setIsPending(false);
    }
  };

  const addMention = (mention: Mention) => {
    if (!mentions.some((m) => m.id === mention.id)) {
      setMentions((prev) => [...prev, mention]);
    }
  };

  const removeMention = (id: string) => {
    setMentions((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex gap-4">
        <div className="shrink-0 pt-1">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="My Avatar"
            className="w-12 h-12 rounded-full object-cover ring-4 ring-slate-50 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind, Alex?"
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 resize-none outline-none min-h-[100px] text-lg font-medium leading-relaxed"
            rows={2}
          />

          {mentions.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-2 -mx-1 px-1">
              {mentions.map((m) => (
                <div key={m.id} className="shrink-0">
                  <MentionChip 
                    mention={m} 
                    onRemove={() => removeMention(m.id)} 
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-1.5">
              <MentionPicker onAdd={addMention} />
              <button 
                type="button"
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isPending}
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-black transition-all shadow-lg active:scale-95 ${
                !content.trim() || isPending
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Post</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
