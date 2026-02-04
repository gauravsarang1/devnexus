
import React, { useState } from 'react';
import { Heart, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { Comment } from '../../types';
import CommentInput from './CommentInput';

interface CommentItemProps {
  comment: Comment;
  level?: number;
  onReply: (parentId: string, content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level = 0, onReply }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likeCount);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const timeFormatted = new Date(comment.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-3">
      <div className={`flex gap-3 ${level > 0 ? 'ml-10' : ''}`}>
        <img 
          src={comment.author.avatar || ''} 
          alt={comment.author.name} 
          className="w-8 h-8 rounded-full border border-slate-100 shrink-0"
        />
        <div className="flex-1 space-y-1">
          <div className="bg-slate-50 rounded-2xl px-4 py-2.5 inline-block min-w-[120px]">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-black text-slate-900">{comment.author.name}</span>
              <span className="text-[10px] font-bold text-slate-400">{timeFormatted}</span>
            </div>
            <p className="text-sm text-slate-700 leading-normal">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-5 pl-2">
            <button 
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-xs font-black transition-colors ${
                isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {likes > 0 && <span>{likes}</span>}
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>

          {showReplyInput && (
            <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
              <CommentInput 
                autoFocus
                replyTo={comment.author.uId}
                onSend={(content) => {
                  onReply(comment.id, content);
                  setShowReplyInput(false);
                  setIsExpanded(true); // Automatically expand to show the new reply
                }} 
              />
            </div>
          )}

          {hasReplies && (
            <div className="pt-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors py-1 pl-2"
              >
                <div className="w-6 h-[1px] bg-blue-100 mr-1" />
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    View {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {hasReplies && isExpanded && (
        <div className="relative">
          {/* Vertical threading line */}
          <div className={`absolute top-0 bottom-0 w-0.5 bg-slate-100 rounded-full ${level > 0 ? 'left-14' : 'left-4'}`} />
          <div className="space-y-4 pt-1">
            {comment.replies!.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                level={level + 1} 
                onReply={onReply}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
