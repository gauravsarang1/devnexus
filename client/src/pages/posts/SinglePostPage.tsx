import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MessageCircle, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { PostCard, PostSkeleton } from "../../components/post";
import CommentItem from "../../components/comments/CommentItem";
import CommentInput from "../../components/comments/CommentInput";
import { Post, Comment } from "../../types";
import { postService } from "../../services/postService";
import { commentService } from "../../services/commentService";
import MobileNav from "@/src/components/MobileNav";

const COMMENTS_LIMIT = 10;

const SinglePostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  /* ---------------- Fetch Logic ---------------- */
  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      setPostLoading(true);
      setError(false);
      try {
        const res = await postService.getPostById(postId);
        setPost(res);
      } catch {
        setError(true);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const fetchComments = useCallback(async (pageNum: number, initial = false) => {
    initial ? setCommentsLoading(true) : setIsFetchingMore(true);
    try {
      const res = await commentService.getPostComments(postId!, {
        page: pageNum,
        limit: COMMENTS_LIMIT,
      });
      setComments((prev) => (pageNum === 1 ? res.comments : [...prev, ...res.comments]));
      setHasMore(res.pagination.hasNextPage);
    } finally {
      setCommentsLoading(false);
      setIsFetchingMore(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    setPage(1);
    setComments([]);
    fetchComments(1, true);
  }, [postId, fetchComments]);

  useEffect(() => {
    if (page > 1) fetchComments(page);
  }, [page, fetchComments]);

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    if (!postId) return;
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString() as any,
      author: { id: "me", name: "You", uId: "you", avatar: null },
      replies: [],
    };
    if (!parentCommentId) setComments((prev) => [optimisticComment, ...prev]);

    try {
      const saved = await commentService.createComment({ postId, content, parentCommentId });
      setComments((prev) => prev.map((c) => (c.id === optimisticComment.id ? saved : c)));
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-[680px] mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-8"
        >
          <ChevronLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Feed</span>
        </button>

        {postLoading ? (
          <PostSkeleton />
        ) : error || !post ? (
          <div className="py-20 text-center">
            <AlertCircle className="mx-auto mb-4 text-slate-200" size={64} />
            <h2 className="text-xl font-black text-slate-800">Post not found</h2>
            <button onClick={() => navigate("/")} className="mt-4 text-blue-600 font-bold underline">Go Home</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* The Main Post */}
            <PostCard post={post} />

            {/* --- FREE DISCUSSION SECTION --- */}
            <div className="mt-16 space-y-10">
              
              {/* Header */}
              <div className="flex items-end justify-between px-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Sparkles size={16} fill="currentColor" className="opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Join the Conversation</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Discussion</h3>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-slate-300">{comments.length}</span>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Comments</span>
                </div>
              </div>

              {/* Input: Stays slightly contained for focus */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-[24px]">
                <CommentInput onSend={handleAddComment} />
              </div>

              {/* Comments List */}
              <div className="pt-4 px-2">
                {commentsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-slate-200" size={40} />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="py-20 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {comments.map((comment) => (
                      <div key={comment.id} className="relative">
                        <CommentItem
                          comment={comment}
                          onReply={(id, content) => handleAddComment(content, id)}
                        />
                      </div>
                    ))}

                    {hasMore && (
                      <div className="flex justify-center pt-10 pb-20">
                        <button
                          onClick={() => setPage((p) => p + 1)}
                          disabled={isFetchingMore}
                          className="flex items-center gap-4 group transition-all"
                        >
                          <div className="h-px w-12 bg-slate-200 group-hover:w-16 group-hover:bg-blue-200 transition-all" />
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600">
                            {isFetchingMore ? "Loading..." : "Load Older"}
                          </span>
                          <div className="h-px w-12 bg-slate-200 group-hover:w-16 group-hover:bg-blue-200 transition-all" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* --- END FREE DISCUSSION --- */}

          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
};

export default SinglePostPage;