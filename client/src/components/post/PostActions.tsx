
import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isAuthenticated?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likeCount: initialLikeCount,
  commentCount,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  isAuthenticated = true
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isActionPending, setIsActionPending] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated || isActionPending) return;

    setIsActionPending(true);
    // Optimistic UI update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      
    } catch (error) {
      // Revert if API fails
      setIsLiked(!newLikedState);
      setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
    } finally {
      setIsActionPending(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated || isActionPending) return;

    setIsActionPending(true);
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
    } catch (error) {
      setIsSaved(!newSavedState);
    } finally {
      setIsActionPending(false);
    }
  };

  const handleGenericAction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50 mt-2">
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLike}
          disabled={!isAuthenticated || isActionPending}
          className={`flex items-center gap-1.5 transition-all group/btn ${
            isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
          }`}
        >
          <Heart 
            className={`w-5 h-5 transition-transform group-active/btn:scale-125 ${
              isLiked ? 'fill-current' : ''
            }`} 
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button 
          onClick={handleGenericAction}
          className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group/btn"
        >
          <MessageCircle className="w-5 h-5 group-active/btn:scale-110" />
          <span className="text-sm font-medium">{commentCount}</span>
        </button>

        <button 
          onClick={handleGenericAction}
          className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group/btn"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <button 
        onClick={handleSave}
        disabled={!isAuthenticated || isActionPending}
        className={`transition-colors p-1.5 rounded-full hover:bg-slate-50 ${
          isSaved ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default PostActions;
