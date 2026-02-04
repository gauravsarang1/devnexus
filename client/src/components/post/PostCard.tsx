
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
className="
  bg-white border border-slate-100 rounded-3xl
  transition-all duration-300
  md:hover:shadow-md
  cursor-pointer
  overflow-hidden
  w-full
  max-w-full
"
    >
      <PostHeader 
        author={post.author} 
        timestamp={post.createdAt} 
      />
      
      <PostContent 
        content={post.content} 
        mentions={post.mentions} 
      />
      
      <PostActions 
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        isLiked={post.isLiked}
        isSaved={post.isSaved}
      />
    </div>
  );
};

export default PostCard;
